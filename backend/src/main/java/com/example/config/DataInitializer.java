package com.example.config;

import com.example.model.*;
import com.example.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Database initialization configuration
 * This class populates the database with sample data on application startup
 */
@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initDatabase(
            RoleRepository roleRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            AddressRepository addressRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            logger.info("Starting database initialization with sample data...");

            // Check if data already exists
            if (roleRepository.count() > 0) {
                logger.info("Database already contains data. Skipping initialization.");
                return;
            }

            // Initialize Roles
            Role adminRole = roleRepository.save(new Role("ROLE_ADMIN", "Administrator with full access"));
            Role userRole = roleRepository.save(new Role("ROLE_USER", "Regular user with standard access"));
            Role guestRole = roleRepository.save(new Role("ROLE_GUEST", "Guest user with limited access"));
            logger.info("Created {} roles", roleRepository.count());

            // Initialize Categories
            Category electronics = categoryRepository.save(new Category("Electronics"));
            Category clothing = categoryRepository.save(new Category("Clothing"));
            Category books = categoryRepository.save(new Category("Books"));
            Category homeGarden = categoryRepository.save(new Category("Home & Garden"));
            Category sports = categoryRepository.save(new Category("Sports & Outdoors"));
            Category toys = categoryRepository.save(new Category("Toys & Games"));
            Category food = categoryRepository.save(new Category("Food & Beverages"));
            Category beauty = categoryRepository.save(new Category("Health & Beauty"));
            logger.info("Created {} categories", categoryRepository.count());

            // Initialize Brands
            Brand techMaster = brandRepository.save(new Brand("TechMaster"));
            Brand fashionHub = brandRepository.save(new Brand("FashionHub"));
            Brand readWell = brandRepository.save(new Brand("ReadWell"));
            Brand homeComfort = brandRepository.save(new Brand("HomeComfort"));
            Brand sportPro = brandRepository.save(new Brand("SportPro"));
            Brand playTime = brandRepository.save(new Brand("PlayTime"));
            Brand freshChoice = brandRepository.save(new Brand("FreshChoice"));
            Brand beautyGlow = brandRepository.save(new Brand("BeautyGlow"));
            Brand smartLife = brandRepository.save(new Brand("SmartLife"));
            Brand activeWear = brandRepository.save(new Brand("ActiveWear"));
            logger.info("Created {} brands", brandRepository.count());

            // Initialize Addresses
            Address address1 = addressRepository.save(new Address("M1M1M1", "Canada", "123 Main St", "Ontario"));
            Address address2 = addressRepository
                    .save(new Address("V5K0A1", "Canada", "456 Oak Avenue", "British Columbia"));
            Address address3 = addressRepository.save(new Address("H2X1Y5", "Canada", "789 Maple Road", "Quebec"));
            Address address4 = addressRepository.save(new Address("T5K2P7", "Canada", "321 Pine Street", "Alberta"));
            Address address5 = addressRepository.save(new Address("K1A0B1", "Canada", "654 Elm Boulevard", "Ontario"));
            logger.info("Created {} addresses", addressRepository.count());

            // Initialize Users (password is 'password123' for all)
            String encodedPassword = passwordEncoder.encode("password123");

            User admin = new User("admin", "admin@estore.com", encodedPassword, adminRole, "+1-416-555-0101", address1);
            userRepository.save(admin);

            User johnDoe = new User("john_doe", "john.doe@email.com", encodedPassword, userRole, "+1-604-555-0102",
                    address2);
            userRepository.save(johnDoe);

            User janeSmith = new User("jane_smith", "jane.smith@email.com", encodedPassword, userRole,
                    "+1-514-555-0103", address3);
            userRepository.save(janeSmith);

            User bobWilson = new User("bob_wilson", "bob.wilson@email.com", encodedPassword, userRole,
                    "+1-403-555-0104", address4);
            userRepository.save(bobWilson);

            User guest = new User("guest_user", "guest@estore.com", encodedPassword, guestRole, "+1-613-555-0105",
                    address5);
            userRepository.save(guest);
            logger.info("Created {} users (default password: password123)", userRepository.count());

            // Initialize Products - Electronics
            productRepository.save(new Product(
                    "Smart Watch Pro",
                    50,
                    299.99,
                    "Advanced smartwatch with health tracking and GPS",
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
                    techMaster,
                    electronics));

            productRepository.save(new Product(
                    "Wireless Headphones",
                    75,
                    159.99,
                    "Noise-canceling wireless headphones with 30-hour battery",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                    techMaster,
                    electronics));

            productRepository.save(new Product(
                    "4K Smart TV",
                    25,
                    799.99,
                    "55-inch 4K Ultra HD Smart LED TV",
                    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
                    smartLife,
                    electronics));

            productRepository.save(new Product(
                    "Laptop Computer",
                    30,
                    1299.99,
                    "High-performance laptop with 16GB RAM and 512GB SSD",
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
                    techMaster,
                    electronics));

            // Clothing
            productRepository.save(new Product(
                    "Classic T-Shirt",
                    200,
                    24.99,
                    "Comfortable cotton t-shirt in various colors",
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
                    fashionHub,
                    clothing));

            productRepository.save(new Product(
                    "Denim Jeans",
                    150,
                    59.99,
                    "Classic fit denim jeans for everyday wear",
                    "https://images.unsplash.com/photo-1542272604-787c3835535d",
                    fashionHub,
                    clothing));

            productRepository.save(new Product(
                    "Running Shoes",
                    100,
                    89.99,
                    "Lightweight running shoes with excellent cushioning",
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
                    activeWear,
                    clothing));

            // Books
            productRepository.save(new Product(
                    "The Art of Programming",
                    80,
                    49.99,
                    "Comprehensive guide to modern programming practices",
                    "https://images.unsplash.com/photo-1532012197267-da84d127e765",
                    readWell,
                    books));

            productRepository.save(new Product(
                    "Mystery Novel Collection",
                    60,
                    34.99,
                    "Bestselling mystery novels bundle (3 books)",
                    "https://images.unsplash.com/photo-1512820790803-83ca734da794",
                    readWell,
                    books));

            // Home & Garden
            productRepository.save(new Product(
                    "Coffee Maker",
                    45,
                    79.99,
                    "Programmable coffee maker with thermal carafe",
                    "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6",
                    homeComfort,
                    homeGarden));

            productRepository.save(new Product(
                    "Garden Tool Set",
                    35,
                    44.99,
                    "Complete 10-piece garden tool set with carrying case",
                    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
                    homeComfort,
                    homeGarden));

            productRepository.save(new Product(
                    "LED Desk Lamp",
                    90,
                    39.99,
                    "Adjustable LED desk lamp with USB charging port",
                    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
                    smartLife,
                    homeGarden));

            // Sports & Outdoors
            productRepository.save(new Product(
                    "Yoga Mat",
                    120,
                    29.99,
                    "Premium non-slip yoga mat with carrying strap",
                    "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",
                    sportPro,
                    sports));

            productRepository.save(new Product(
                    "Camping Tent",
                    40,
                    149.99,
                    "4-person weatherproof camping tent",
                    "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d",
                    sportPro,
                    sports));

            productRepository.save(new Product(
                    "Basketball",
                    85,
                    34.99,
                    "Official size and weight basketball",
                    "https://images.unsplash.com/photo-1546519638-68e109498ffc",
                    sportPro,
                    sports));

            // Toys & Games
            productRepository.save(new Product(
                    "Building Blocks Set",
                    110,
                    39.99,
                    "500-piece creative building blocks set",
                    "https://images.unsplash.com/photo-1558060370-d644479cb6f7",
                    playTime,
                    toys));

            productRepository.save(new Product(
                    "Board Game Collection",
                    70,
                    54.99,
                    "Classic board games family pack",
                    "https://images.unsplash.com/photo-1606167668584-78701c57f13d",
                    playTime,
                    toys));

            // Food & Beverages
            productRepository.save(new Product(
                    "Organic Coffee Beans",
                    95,
                    18.99,
                    "Premium organic whole coffee beans (1kg)",
                    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e",
                    freshChoice,
                    food));

            productRepository.save(new Product(
                    "Green Tea Collection",
                    130,
                    12.99,
                    "Assorted premium green tea varieties (20 bags)",
                    "https://images.unsplash.com/photo-1556679343-c7306c1976bc",
                    freshChoice,
                    food));

            // Health & Beauty
            productRepository.save(new Product(
                    "Skincare Set",
                    65,
                    89.99,
                    "Complete daily skincare routine set",
                    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571",
                    beautyGlow,
                    beauty));

            productRepository.save(new Product(
                    "Electric Toothbrush",
                    55,
                    69.99,
                    "Rechargeable electric toothbrush with multiple modes",
                    "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04",
                    beautyGlow,
                    beauty));

            productRepository.save(new Product(
                    "Fitness Tracker",
                    80,
                    129.99,
                    "Water-resistant fitness tracker with heart rate monitor",
                    "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6",
                    sportPro,
                    beauty));

            logger.info("Created {} products", productRepository.count());
            logger.info("Database initialization completed successfully!");
            logger.info("-----------------------------------");
            logger.info("Sample user credentials:");
            logger.info("Admin - username: admin, password: password123");
            logger.info("User - username: john_doe, password: password123");
            logger.info("User - username: jane_smith, password: password123");
            logger.info("-----------------------------------");
        };
    }
}
