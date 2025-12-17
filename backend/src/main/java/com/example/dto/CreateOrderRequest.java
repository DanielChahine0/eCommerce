package com.example.dto;

import jakarta.validation.constraints.NotNull;

public class CreateOrderRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Address ID is required")
    private Long addressId;
    
    // Constructors
    public CreateOrderRequest() {}
    
    public CreateOrderRequest(Long userId, Long addressId) {
        this.userId = userId;
        this.addressId = addressId;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Long getAddressId() {
        return addressId;
    }
    
    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }
}
