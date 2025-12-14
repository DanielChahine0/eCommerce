package com.example.estore.dto;

import jakarta.validation.constraints.*;

public class CreateOrderRequest {
    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotNull(message = "Address ID is required")
    private Integer addressId;

    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getAddressId() {
        return addressId;
    }

    public void setAddressId(Integer addressId) {
        this.addressId = addressId;
    }
}
