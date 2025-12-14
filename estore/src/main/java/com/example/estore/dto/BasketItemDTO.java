package com.example.estore.dto;

public class BasketItemDTO {
    private Integer id;
    private ProductDTO product;
    private Integer quantity;

    public BasketItemDTO() {
    }

    public BasketItemDTO(Integer id, ProductDTO product, Integer quantity) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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
