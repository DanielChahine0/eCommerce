package com.example.estore.model;

import jakarta.persistence.*;

@Entity
@Table(name = "jewelry")
public class Jewelry extends Product {

    private String color;

    // Constructors
    public Jewelry() {
        super();
    }

    public Jewelry(String name, Integer quantity, String description, String image, Brand brand, Category category,
            String color) {
        super(name, quantity, description, image, brand, category);
        this.color = color;
    }

    // Getters and Setters
    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
