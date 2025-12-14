package com.example.estore.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sports")
public class Sports extends Product {

    // Constructors
    public Sports() {
        super();
    }

    public Sports(String name, Integer quantity, String description, String image, Brand brand, Category category) {
        super(name, quantity, description, image, brand, category);
    }
}
