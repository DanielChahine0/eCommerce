-- Sample Data for eCommerce Application
-- This migration inserts sample data for roles, categories, brands, addresses, users, and products
-- Insert Roles
INSERT INTO roles (name, description)
VALUES ('ROLE_ADMIN', 'Administrator with full access'),
    ('ROLE_USER', 'Regular user with standard access'),
    ('ROLE_GUEST', 'Guest user with limited access') ON CONFLICT (name) DO NOTHING;
-- Insert Categories
INSERT INTO categories (name)
VALUES ('Electronics'),
    ('Clothing'),
    ('Books'),
    ('Home & Garden'),
    ('Sports & Outdoors'),
    ('Toys & Games'),
    ('Food & Beverages'),
    ('Health & Beauty') ON CONFLICT (name) DO NOTHING;
-- Insert Brands
INSERT INTO brands (name)
VALUES ('TechMaster'),
    ('FashionHub'),
    ('ReadWell'),
    ('HomeComfort'),
    ('SportPro'),
    ('PlayTime'),
    ('FreshChoice'),
    ('BeautyGlow'),
    ('SmartLife'),
    ('ActiveWear') ON CONFLICT (name) DO NOTHING;
-- Insert Sample Addresses
INSERT INTO addresses (street, province, zip, country)
VALUES ('123 Main St', 'Ontario', 'M1M1M1', 'Canada'),
    (
        '456 Oak Avenue',
        'British Columbia',
        'V5K0A1',
        'Canada'
    ),
    ('789 Maple Road', 'Quebec', 'H2X1Y5', 'Canada'),
    ('321 Pine Street', 'Alberta', 'T5K2P7', 'Canada'),
    (
        '654 Elm Boulevard',
        'Ontario',
        'K1A0B1',
        'Canada'
    );
-- Insert Sample Users (password is 'password123' hashed with BCrypt)
-- Note: The password hash is for 'password123'
INSERT INTO users (
        username,
        email,
        password,
        role_id,
        phone_number,
        address_id
    )
VALUES (
        'admin',
        'admin@estore.com',
        '$2a$10$xDBKoM67BbLZhV.Rq8ZSBOMhEkB9wOF6VfmjqLvLXvpJqxfchvtWq',
        (
            SELECT id
            FROM roles
            WHERE name = 'ROLE_ADMIN'
        ),
        '+1-416-555-0101',
        (
            SELECT id
            FROM addresses
            WHERE street = '123 Main St'
        )
    ),
    (
        'john_doe',
        'john.doe@email.com',
        '$2a$10$xDBKoM67BbLZhV.Rq8ZSBOMhEkB9wOF6VfmjqLvLXvpJqxfchvtWq',
        (
            SELECT id
            FROM roles
            WHERE name = 'ROLE_USER'
        ),
        '+1-604-555-0102',
        (
            SELECT id
            FROM addresses
            WHERE street = '456 Oak Avenue'
        )
    ),
    (
        'jane_smith',
        'jane.smith@email.com',
        '$2a$10$xDBKoM67BbLZhV.Rq8ZSBOMhEkB9wOF6VfmjqLvLXvpJqxfchvtWq',
        (
            SELECT id
            FROM roles
            WHERE name = 'ROLE_USER'
        ),
        '+1-514-555-0103',
        (
            SELECT id
            FROM addresses
            WHERE street = '789 Maple Road'
        )
    ),
    (
        'bob_wilson',
        'bob.wilson@email.com',
        '$2a$10$xDBKoM67BbLZhV.Rq8ZSBOMhEkB9wOF6VfmjqLvLXvpJqxfchvtWq',
        (
            SELECT id
            FROM roles
            WHERE name = 'ROLE_USER'
        ),
        '+1-403-555-0104',
        (
            SELECT id
            FROM addresses
            WHERE street = '321 Pine Street'
        )
    ),
    (
        'guest_user',
        'guest@estore.com',
        '$2a$10$xDBKoM67BbLZhV.Rq8ZSBOMhEkB9wOF6VfmjqLvLXvpJqxfchvtWq',
        (
            SELECT id
            FROM roles
            WHERE name = 'ROLE_GUEST'
        ),
        '+1-613-555-0105',
        (
            SELECT id
            FROM addresses
            WHERE street = '654 Elm Boulevard'
        )
    ) ON CONFLICT (username) DO NOTHING;
-- Insert Sample Products
INSERT INTO products (
        name,
        description,
        quantity,
        image,
        brand_id,
        category_id
    )
VALUES -- Electronics
    (
        'Smart Watch Pro',
        'Advanced smartwatch with health tracking and GPS',
        50,
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        (
            SELECT id
            FROM brands
            WHERE name = 'TechMaster'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Electronics'
        )
    ),
    (
        'Wireless Headphones',
        'Noise-canceling wireless headphones with 30-hour battery',
        75,
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        (
            SELECT id
            FROM brands
            WHERE name = 'TechMaster'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Electronics'
        )
    ),
    (
        '4K Smart TV',
        '55-inch 4K Ultra HD Smart LED TV',
        25,
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
        (
            SELECT id
            FROM brands
            WHERE name = 'SmartLife'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Electronics'
        )
    ),
    (
        'Laptop Computer',
        'High-performance laptop with 16GB RAM and 512GB SSD',
        30,
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
        (
            SELECT id
            FROM brands
            WHERE name = 'TechMaster'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Electronics'
        )
    ),
    -- Clothing
    (
        'Classic T-Shirt',
        'Comfortable cotton t-shirt in various colors',
        200,
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        (
            SELECT id
            FROM brands
            WHERE name = 'FashionHub'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Clothing'
        )
    ),
    (
        'Denim Jeans',
        'Classic fit denim jeans for everyday wear',
        150,
        'https://images.unsplash.com/photo-1542272604-787c3835535d',
        (
            SELECT id
            FROM brands
            WHERE name = 'FashionHub'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Clothing'
        )
    ),
    (
        'Running Shoes',
        'Lightweight running shoes with excellent cushioning',
        100,
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        (
            SELECT id
            FROM brands
            WHERE name = 'ActiveWear'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Clothing'
        )
    ),
    -- Books
    (
        'The Art of Programming',
        'Comprehensive guide to modern programming practices',
        80,
        'https://images.unsplash.com/photo-1532012197267-da84d127e765',
        (
            SELECT id
            FROM brands
            WHERE name = 'ReadWell'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Books'
        )
    ),
    (
        'Mystery Novel Collection',
        'Bestselling mystery novels bundle (3 books)',
        60,
        'https://images.unsplash.com/photo-1512820790803-83ca734da794',
        (
            SELECT id
            FROM brands
            WHERE name = 'ReadWell'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Books'
        )
    ),
    -- Home & Garden
    (
        'Coffee Maker',
        'Programmable coffee maker with thermal carafe',
        45,
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6',
        (
            SELECT id
            FROM brands
            WHERE name = 'HomeComfort'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Home & Garden'
        )
    ),
    (
        'Garden Tool Set',
        'Complete 10-piece garden tool set with carrying case',
        35,
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
        (
            SELECT id
            FROM brands
            WHERE name = 'HomeComfort'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Home & Garden'
        )
    ),
    (
        'LED Desk Lamp',
        'Adjustable LED desk lamp with USB charging port',
        90,
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
        (
            SELECT id
            FROM brands
            WHERE name = 'SmartLife'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Home & Garden'
        )
    ),
    -- Sports & Outdoors
    (
        'Yoga Mat',
        'Premium non-slip yoga mat with carrying strap',
        120,
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
        (
            SELECT id
            FROM brands
            WHERE name = 'SportPro'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Sports & Outdoors'
        )
    ),
    (
        'Camping Tent',
        '4-person weatherproof camping tent',
        40,
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d',
        (
            SELECT id
            FROM brands
            WHERE name = 'SportPro'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Sports & Outdoors'
        )
    ),
    (
        'Basketball',
        'Official size and weight basketball',
        85,
        'https://images.unsplash.com/photo-1546519638-68e109498ffc',
        (
            SELECT id
            FROM brands
            WHERE name = 'SportPro'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Sports & Outdoors'
        )
    ),
    -- Toys & Games
    (
        'Building Blocks Set',
        '500-piece creative building blocks set',
        110,
        'https://images.unsplash.com/photo-1558060370-d644479cb6f7',
        (
            SELECT id
            FROM brands
            WHERE name = 'PlayTime'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Toys & Games'
        )
    ),
    (
        'Board Game Collection',
        'Classic board games family pack',
        70,
        'https://images.unsplash.com/photo-1606167668584-78701c57f13d',
        (
            SELECT id
            FROM brands
            WHERE name = 'PlayTime'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Toys & Games'
        )
    ),
    -- Food & Beverages
    (
        'Organic Coffee Beans',
        'Premium organic whole coffee beans (1kg)',
        95,
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
        (
            SELECT id
            FROM brands
            WHERE name = 'FreshChoice'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Food & Beverages'
        )
    ),
    (
        'Green Tea Collection',
        'Assorted premium green tea varieties (20 bags)',
        130,
        'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
        (
            SELECT id
            FROM brands
            WHERE name = 'FreshChoice'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Food & Beverages'
        )
    ),
    -- Health & Beauty
    (
        'Skincare Set',
        'Complete daily skincare routine set',
        65,
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571',
        (
            SELECT id
            FROM brands
            WHERE name = 'BeautyGlow'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Health & Beauty'
        )
    ),
    (
        'Electric Toothbrush',
        'Rechargeable electric toothbrush with multiple modes',
        55,
        'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04',
        (
            SELECT id
            FROM brands
            WHERE name = 'BeautyGlow'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Health & Beauty'
        )
    ),
    (
        'Fitness Tracker',
        'Water-resistant fitness tracker with heart rate monitor',
        80,
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6',
        (
            SELECT id
            FROM brands
            WHERE name = 'SportPro'
        ),
        (
            SELECT id
            FROM categories
            WHERE name = 'Health & Beauty'
        )
    );
-- Note: Basket and Order data would typically be created through user interactions
-- and are not pre-populated