package com.example.estore.service;

import com.example.estore.dto.*;
import com.example.estore.exception.InsufficientStockException;
import com.example.estore.exception.InvalidOperationException;
import com.example.estore.exception.ResourceNotFoundException;
import com.example.estore.model.*;
import com.example.estore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final BasketRepository basketRepository;
    private final ProductRepository productRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            BasketRepository basketRepository,
            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.basketRepository = basketRepository;
        this.productRepository = productRepository;
    }

    public OrderDTO createOrder(CreateOrderRequest request) {
        // Validate user exists
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));

        // Validate address exists
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", request.getAddressId()));

        // Get user's basket items
        List<Basket> basketItems = basketRepository.findByUserId(request.getUserId());

        if (basketItems.isEmpty()) {
            throw new InvalidOperationException("Cannot create order with empty basket");
        }

        // Validate stock and calculate total
        BigDecimal total = BigDecimal.ZERO;
        for (Basket item : basketItems) {
            Product product = item.getProduct();

            // Check stock availability
            if (product.getQuantity() < item.getQuantity()) {
                throw new InsufficientStockException(
                        product.getName(),
                        product.getQuantity(),
                        item.getQuantity());
            }

            // Note: Assuming Product should have a price field
            // For now, we'll set total to 0 as price is not in the model
            // You should add a price field to Product model
        }

        // Create order with first basket item (simplified for now)
        // In a real system, you'd want to store all items in a separate OrderItems
        // table
        Basket firstBasketItem = basketItems.get(0);
        Order order = new Order(
                user,
                OrderStatus.PENDING,
                address,
                firstBasketItem,
                total);

        order = orderRepository.save(order);

        // Reduce inventory for all products
        for (Basket item : basketItems) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        // Clear user's basket
        basketRepository.deleteByUserId(request.getUserId());

        return convertToDTO(order, basketItems);
    }

    public OrderDTO getOrderById(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        List<Basket> basketItems = new ArrayList<>();
        basketItems.add(order.getBasket());

        return convertToDTO(order, basketItems);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> {
                    List<Basket> basketItems = new ArrayList<>();
                    basketItems.add(order.getBasket());
                    return convertToDTO(order, basketItems);
                })
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByUserId(Integer userId) {
        // Validate user exists
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }

        return orderRepository.findByUserIdOrderByTimeCreatedDesc(userId).stream()
                .map(order -> {
                    List<Basket> basketItems = new ArrayList<>();
                    basketItems.add(order.getBasket());
                    return convertToDTO(order, basketItems);
                })
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(order -> {
                    List<Basket> basketItems = new ArrayList<>();
                    basketItems.add(order.getBasket());
                    return convertToDTO(order, basketItems);
                })
                .collect(Collectors.toList());
    }

    public OrderDTO updateOrderStatus(Integer id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        // Validate status transition
        validateStatusTransition(order.getStatus(), newStatus);

        order.setStatus(newStatus);
        order = orderRepository.save(order);

        List<Basket> basketItems = new ArrayList<>();
        basketItems.add(order.getBasket());

        return convertToDTO(order, basketItems);
    }

    public void cancelOrder(Integer id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        // Only allow cancellation of pending or processing orders
        if (order.getStatus() == OrderStatus.SHIPPED ||
                order.getStatus() == OrderStatus.DELIVERED ||
                order.getStatus() == OrderStatus.CANCELLED) {
            throw new InvalidOperationException(
                    "Cannot cancel order with status: " + order.getStatus());
        }

        // Restore inventory
        Basket basketItem = order.getBasket();
        Product product = basketItem.getProduct();
        product.setQuantity(product.getQuantity() + basketItem.getQuantity());
        productRepository.save(product);

        // Update order status
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        // Business rules for status transitions
        if (currentStatus == OrderStatus.CANCELLED) {
            throw new InvalidOperationException("Cannot change status of cancelled order");
        }

        if (currentStatus == OrderStatus.DELIVERED) {
            throw new InvalidOperationException("Cannot change status of delivered order");
        }

        // Add more validation rules as needed
    }

    private OrderDTO convertToDTO(Order order, List<Basket> basketItems) {
        AddressDTO addressDTO = new AddressDTO(
                order.getAddress().getId(),
                order.getAddress().getZip(),
                order.getAddress().getCountry(),
                order.getAddress().getStreet(),
                order.getAddress().getProvince());

        List<BasketItemDTO> itemDTOs = basketItems.stream()
                .map(item -> {
                    Product product = item.getProduct();
                    ProductDTO productDTO = new ProductDTO(
                            product.getId(),
                            product.getName(),
                            product.getQuantity(),
                            product.getDescription(),
                            product.getImage(),
                            product.getBrand().getId(),
                            product.getBrand().getName(),
                            product.getCategory().getId(),
                            product.getCategory().getName());
                    return new BasketItemDTO(item.getId(), productDTO, item.getQuantity());
                })
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getStatus().toString(),
                addressDTO,
                itemDTOs,
                order.getTotal(),
                order.getTimeCreated());
    }
}
