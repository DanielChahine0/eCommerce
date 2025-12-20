package com.example.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateProductRequest {
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity cannot be negative")
    private Integer quantity;
    
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double price;
    
    private String description;
    private String image;
    
    @NotNull(message = "Brand ID is required")
    private Long brandId;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    // Constructors
    public CreateProductRequest() {}
    
    public CreateProductRequest(String name, Integer quantity, Double price, String description, String image, Long brandId, Long categoryId) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.description = description;
        this.image = image;
        this.brandId = brandId;
        this.categoryId = categoryId;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getImage() {
        return image;
    }
    
    public void setImage(String image) {
        this.image = image;
    }
    
    public Long getBrandId() {
        return brandId;
    }
    
    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
