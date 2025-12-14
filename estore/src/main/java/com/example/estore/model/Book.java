package com.example.estore.model;

import jakarta.persistence.*;

@Entity
@Table(name = "books")
public class Book extends Product {

    private String genre;

    // Constructors
    public Book() {
        super();
    }

    public Book(String name, Integer quantity, String description, String image, Brand brand, Category category,
            String genre) {
        super(name, quantity, description, image, brand, category);
        this.genre = genre;
    }

    // Getters and Setters
    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }
}
