package com.example.estore.config;

import com.example.estore.model.*;
import com.example.estore.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * DataInitializer - Populates the database with sample data on application
 * startup.
 * This is useful for testing and development.
 * 
 * To disable this, comment out the @Bean annotation or delete this file.
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            AddressRepository addressRepository,
            UserRepository userRepository) {

        return args -> {
            // Create Brands
            Brand apple = brandRepository.save(new Brand("Apple"));
            Brand samsung = brandRepository.save(new Brand("Samsung"));
            Brand nike = brandRepository.save(new Brand("Nike"));
            Brand adidas = brandRepository.save(new Brand("Adidas"));

            // Create Categories
            Category electronics = categoryRepository.save(new Category("Electronics"));
            Category clothing = categoryRepository.save(new Category("Clothing"));
            Category sports = categoryRepository.save(new Category("Sports"));
            categoryRepository.save(new Category("Books"));

            // Create Products
            productRepository.save(new Product(
                    "iPhone 15 Pro",
                    100,
                    "Latest iPhone with A17 Pro chip",
                    "iphone15.jpg",
                    apple,
                    electronics));

            productRepository.save(new Product(
                    "MacBook Pro M3",
                    50,
                    "Powerful laptop for professionals",
                    "macbook.jpg",
                    apple,
                    electronics));

            productRepository.save(new Product(
                    "Samsung Galaxy S24",
                    75,
                    "Premium Android smartphone",
                    "galaxys24.jpg",
                    samsung,
                    electronics));

            productRepository.save(new Product(
                    "Nike Air Max",
                    200,
                    "Comfortable running shoes",
                    "airmax.jpg",
                    nike,
                    sports));

            productRepository.save(new Product(
                    "Adidas Ultraboost",
                    150,
                    "High-performance running shoes",
                    "ultraboost.jpg",
                    adidas,
                    sports));

            productRepository.save(new Product(
                    "Nike Sportswear T-Shirt",
                    300,
                    "Cotton t-shirt for casual wear",
                    "nike-tshirt.jpg",
                    nike,
                    clothing));

            // Create Addresses
            Address addr1 = addressRepository.save(new Address(
                    "10001",
                    "USA",
                    "123 Broadway",
                    "New York"));

            Address addr2 = addressRepository.save(new Address(
                    "90001",
                    "USA",
                    "456 Hollywood Blvd",
                    "California"));

            // Create Users
            userRepository.save(new User(
                    "admin",
                    "admin",
                    addr1,
                    "admin@estore.com"));

            userRepository.save(new User(
                    "john_doe",
                    "customer",
                    addr2,
                    "john@example.com"));

            userRepository.save(new User(
                    "jane_smith",
                    "customer",
                    addr1,
                    "jane@example.com"));

            System.out.println("✅ Database initialized with sample data!");
            System.out.println("📦 Products: 6");
            System.out.println("👥 Users: 3");
            System.out.println("🏷️ Brands: 4");
            System.out.println("📂 Categories: 4");
        };
    }
}
