package com.example.dto;

import jakarta.validation.constraints.Email;
import java.util.List;

public class CreateOrderRequest {
    
    // For authenticated users
    private Long userId;
    private Long addressId;
    
    // For guest checkout
    @Email(message = "Valid email is required for guest checkout")
    private String guestEmail;
    private AddressDTO guestAddress;
    private List<OrderItemDTO> items;
    
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
    
    public String getGuestEmail() {
        return guestEmail;
    }
    
    public void setGuestEmail(String guestEmail) {
        this.guestEmail = guestEmail;
    }
    
    public AddressDTO getGuestAddress() {
        return guestAddress;
    }
    
    public void setGuestAddress(AddressDTO guestAddress) {
        this.guestAddress = guestAddress;
    }
    
    public List<OrderItemDTO> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }
    
    public boolean isGuestOrder() {
        return userId == null && guestEmail != null;
    }
}
