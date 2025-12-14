package com.example.estore.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tech")
public class Tech extends Product {

    // Constructors
    public Tech() {
        super();
    }

    public Tech(String name, Integer quantity, String description, String image, Brand brand, Category category) {
        super(name, quantity, description, image, brand, category);
    }
}
