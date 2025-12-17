package com.example.dto;

import com.example.model.OrderStatus;
import java.time.LocalDateTime;

public class OrderDTO {
    
    private Long id;
    private Long userId;
    private String username;
    private AddressDTO address;
    private OrderStatus status;
    private Double total;
    private LocalDateTime timeCreated;
    
    // Constructors
    public OrderDTO() {}
    
    public OrderDTO(Long id, Long userId, String username, AddressDTO address, 
                    OrderStatus status, Double total, LocalDateTime timeCreated) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.address = address;
        this.status = status;
        this.total = total;
        this.timeCreated = timeCreated;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public AddressDTO getAddress() {
        return address;
    }
    
    public void setAddress(AddressDTO address) {
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
}
