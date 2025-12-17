package com.example.dto;

public class ProductDTO {
    
    private Long id;
    private String name;
    private Integer quantity;
    private String description;
    private String image;
    private String brandName;
    private Long brandId;
    private String categoryName;
    private Long categoryId;
    
    // Constructors
    public ProductDTO() {}
    
    public ProductDTO(Long id, String name, Integer quantity, String description, String image, 
                      String brandName, Long brandId, String categoryName, Long categoryId) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.description = description;
        this.image = image;
        this.brandName = brandName;
        this.brandId = brandId;
        this.categoryName = categoryName;
        this.categoryId = categoryId;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public String getBrandName() {
        return brandName;
    }
    
    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }
    
    public Long getBrandId() {
        return brandId;
    }
    
    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
