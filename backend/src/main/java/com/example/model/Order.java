package com.example.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;
    
    @Column(nullable = false)
    private Double total;
    
    @Column(name = "time_created", nullable = false)
    private LocalDateTime timeCreated;
    
    // For simplicity, storing basket items as a simple relationship
    // In a real application, you'd have an OrderItem entity
    @ManyToOne
    @JoinColumn(name = "basket_id")
    private Basket basket;
    
    // Constructors
    public Order() {
        this.timeCreated = LocalDateTime.now();
        this.status = OrderStatus.PENDING;
    }
    
    public Order(User user, Address address, Double total) {
        this.user = user;
        this.address = address;
        this.total = total;
        this.status = OrderStatus.PENDING;
        this.timeCreated = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Address getAddress() {
        return address;
    }
    
    public void setAddress(Address address) {
        this.address = address;
    }
    
    public OrderStatus getStatus() {
        return status;
    }
    
    public void setStatus(OrderStatus status) {
        this.status = status;
    }
    
    public Double getTotal() {
        return total;
    }
    
    public void setTotal(Double total) {
        this.total = total;
    }
    
    public LocalDateTime getTimeCreated() {
        return timeCreated;
    }
    
    public void setTimeCreated(LocalDateTime timeCreated) {
        this.timeCreated = timeCreated;
    }
    
    public Basket getBasket() {
        return basket;
    }
    
    public void setBasket(Basket basket) {
        this.basket = basket;
    }
}
