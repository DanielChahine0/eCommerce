package com.example.service;

import com.example.dto.AddressDTO;
import com.example.dto.CreateOrderRequest;
import com.example.dto.OrderDTO;
import com.example.dto.OrderItemDTO;
import com.example.exception.InvalidOperationException;
import com.example.exception.ResourceNotFoundException;
import com.example.exception.InsufficientStockException;
import com.example.model.*;
import com.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private BasketRepository basketRepository;

    @Autowired
    private ProductRepository productRepository;

    public OrderDTO createOrder(CreateOrderRequest request) {
        if (request.isGuestOrder()) {
            return createGuestOrder(request);
        } else {
            return createAuthenticatedOrder(request);
        }
    }

    private OrderDTO createAuthenticatedOrder(CreateOrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: '" + request.getUserId() + "'"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Address not found with id: '" + request.getAddressId() + "'"));

        // Get user's basket
        List<Basket> basketItems = basketRepository.findByUserId(request.getUserId());

        if (basketItems.isEmpty()) {
            throw new InvalidOperationException(
                    "Cannot create order with empty basket");
        }

        // Validate stock and calculate total
        double total = 0.0;
        for (Basket basketItem : basketItems) {
            Product product = basketItem.getProduct();

            // Check stock availability
            if (product.getQuantity() < basketItem.getQuantity()) {
                throw new InsufficientStockException(
                        "Insufficient stock for product '" + product.getName() +
                                "'. Available: " + product.getQuantity() +
                                ", Required: " + basketItem.getQuantity());
            }

            // Calculate total using actual product price
            total += basketItem.getQuantity() * product.getPrice();
        }

        // Create order
        Order order = new Order(user, address, total);

        // Reduce inventory
        for (Basket basketItem : basketItems) {
            Product product = basketItem.getProduct();
            product.setQuantity(product.getQuantity() - basketItem.getQuantity());
            productRepository.save(product);
        }

        Order savedOrder = orderRepository.save(order);

        // Clear user's basket after successful order
        basketRepository.deleteByUserId(request.getUserId());

        return convertToDTO(savedOrder);
    }

    private OrderDTO createGuestOrder(CreateOrderRequest request) {
        if (request.getGuestEmail() == null || request.getGuestEmail().trim().isEmpty()) {
            throw new InvalidOperationException("Guest email is required");
        }

        if (request.getGuestAddress() == null) {
            throw new InvalidOperationException("Guest shipping address is required");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new InvalidOperationException("Order items are required for guest checkout");
        }

        // Get or create the guest user
        User guestUser = userRepository.findByUsername("guest_user")
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Guest user not found. Please ensure the database is properly initialized."));

        // Create address for guest order
        AddressDTO guestAddressDTO = request.getGuestAddress();
        Address guestAddress = new Address(
                guestAddressDTO.getZip(),
                guestAddressDTO.getCountry(),
                guestAddressDTO.getStreet(),
                guestAddressDTO.getProvince());
        Address savedAddress = addressRepository.save(guestAddress);

        // Validate stock and calculate total
        double total = 0.0;
        for (OrderItemDTO item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: '" + item.getProductId() + "'"));

            // Check stock availability
            if (product.getQuantity() < item.getQuantity()) {
                throw new InsufficientStockException(
                        "Insufficient stock for product '" + product.getName() +
                                "'. Available: " + product.getQuantity() +
                                ", Required: " + item.getQuantity());
            }

            // Calculate total using actual product price
            total += item.getQuantity() * product.getPrice();
        }

        // Create order with guest user
        Order order = new Order(guestUser, savedAddress, total);

        // Reduce inventory
        for (OrderItemDTO item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId()).get();
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        Order savedOrder = orderRepository.save(order);

        return convertToDTO(savedOrder);
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: '" + id + "'"));
        return convertToDTO(order);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException(
                    "User not found with id: '" + userId + "'");
        }
        return orderRepository.findByUserIdOrderByTimeCreatedDesc(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: '" + id + "'"));

        // Validate status transition
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new InvalidOperationException(
                    "Cannot modify a cancelled order");
        }

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new InvalidOperationException(
                    "Cannot modify a delivered order");
        }

        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }

    public void cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: '" + id + "'"));

        // Only pending or processing orders can be cancelled
        if (order.getStatus() == OrderStatus.SHIPPED ||
                order.getStatus() == OrderStatus.DELIVERED) {
            throw new InvalidOperationException(
                    "Cannot cancel order with status: " + order.getStatus());
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new InvalidOperationException("Order is already cancelled");
        }

        // Restore inventory (simplified - in real app, you'd track order items)
        // For now, we'll just mark as cancelled
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    private OrderDTO convertToDTO(Order order) {
        AddressDTO addressDTO = new AddressDTO(
                order.getAddress().getId(),
                order.getAddress().getZip(),
                order.getAddress().getCountry(),
                order.getAddress().getStreet(),
                order.getAddress().getProvince());

        // Handle guest orders (user may be null)
        Long userId = order.getUser() != null ? order.getUser().getId() : null;
        String username = order.getUser() != null ? order.getUser().getUsername() : "Guest";

        return new OrderDTO(
                order.getId(),
                userId,
                username,
                addressDTO,
                order.getStatus(),
                order.getTotal(),
                order.getTimeCreated());
    }
}
