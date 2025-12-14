package com.example.estore.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clothes")
public class Clothing extends Product {

    private String size;
    private String color;

    // Constructors
    public Clothing() {
        super();
    }

    public Clothing(String name, Integer quantity, String description, String image, Brand brand, Category category,
            String size, String color) {
        super(name, quantity, description, image, brand, category);
        this.size = size;
        this.color = color;
    }

    // Getters and Setters
    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
