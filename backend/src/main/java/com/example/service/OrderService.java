package com.example.service;

import com.example.dto.AddressDTO;
import com.example.dto.CreateOrderRequest;
import com.example.dto.OrderDTO;
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
            
            // For now, using a simple calculation (can be enhanced with price)
            total += basketItem.getQuantity() * 10.0; // Placeholder price
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
            order.getAddress().getProvince()
        );
        
        return new OrderDTO(
            order.getId(),
            order.getUser().getId(),
            order.getUser().getUsername(),
            addressDTO,
            order.getStatus(),
            order.getTotal(),
            order.getTimeCreated()
        );
    }
}
