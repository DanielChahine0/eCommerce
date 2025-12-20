package com.example.dto;

public class BasketItemDTO {
    
    private Long id;
    private Long userId;
    private ProductDTO product;
    private Integer quantity;
    
    // Constructors
    public BasketItemDTO() {}
    
    public BasketItemDTO(Long id, Long userId, ProductDTO product, Integer quantity) {
        this.id = id;
        this.userId = userId;
        this.product = product;
        this.quantity = quantity;
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
    
    public ProductDTO getProduct() {
        return product;
    }
    
    public void setProduct(ProductDTO product) {
        this.product = product;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
