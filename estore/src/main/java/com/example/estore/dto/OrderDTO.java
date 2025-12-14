package com.example.estore.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDTO {
    private Integer id;
    private Integer userId;
    private String username;
    private String status;
    private AddressDTO address;
    private List<BasketItemDTO> items;
    private BigDecimal total;
    private LocalDateTime timeCreated;

    public OrderDTO() {
    }

    public OrderDTO(Integer id, Integer userId, String username, String status,
            AddressDTO address, List<BasketItemDTO> items, BigDecimal total, LocalDateTime timeCreated) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.status = status;
        this.address = address;
        this.items = items;
        this.total = total;
        this.timeCreated = timeCreated;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public AddressDTO getAddress() {
        return address;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }

    public List<BasketItemDTO> getItems() {
        return items;
    }

    public void setItems(List<BasketItemDTO> items) {
        this.items = items;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public LocalDateTime getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(LocalDateTime timeCreated) {
        this.timeCreated = timeCreated;
    }
}
