# eCommerce Application Architecture

## Table of Contents
- [eCommerce Application Architecture](#ecommerce-application-architecture)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [System Architecture](#system-architecture)
  - [Architecture Patterns](#architecture-patterns)
    - [1. 3-Tier Architecture](#1-3-tier-architecture)
      - [**Presentation Tier (Frontend)**](#presentation-tier-frontend)
      - [**Application Tier (Backend)**](#application-tier-backend)
      - [**Data Tier (Database)**](#data-tier-database)
    - [2. MVC Pattern (Backend)](#2-mvc-pattern-backend)
      - [**Model**](#model)
      - [**View**](#view)
      - [**Controller**](#controller)
    - [3. Service Layer Pattern](#3-service-layer-pattern)
    - [4. Repository/DAO Pattern](#4-repositorydao-pattern)

---

## Overview

This eCommerce application implements a modern **3-tier architecture** with complete separation between the frontend, backend, and database layers. The system follows industry-standard design patterns including MVC (Model-View-Controller), RESTful APIs, and microservices principles to ensure scalability, maintainability, and security.

---

## System Architecture

The application is structured into three distinct tiers that communicate through well-defined interfaces:
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION TIER │
│ (Frontend - React) │
│ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ Components │ │ Pages/Views │ │ Redux Store │ │
│ │ - Navbar │ │ - Catalog │ │ - Auth │ │
│ │ - Cart │ │ - Checkout │ │ - Products │ │
│ │ - Product │ │ - Profile │ │ - Basket │ │
│ │ - Admin │ │ - Admin │ │ - Orders │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
│ │ │ │ │
│ └────────────────┴──────────────────┘ │
│ │ │
│ ┌───────▼────────┐ │
│ │ API Client │ │
│ │ (Axios/Fetch) │ │
│ └───────┬────────┘ │
└────────────────────────────┼──────────────────────────────┘
│
HTTP/REST API (JSON)
│
┌────────────────────────────▼──────────────────────────────┐
│ APPLICATION TIER │
│ (Backend - Spring Boot) │
│ │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ CONTROLLER LAYER │ │
│ │ (REST API Endpoints - HTTP Request/Response) │ │
│ │ │ │
│ │ - AuthController - ProductController │ │
│ │ - UserController - BasketController │ │
│ │ - OrderController - RoleController │ │
│ └────────────────────┬─────────────────────────────────┘ │
│ │ │
│ ┌────────────────────▼─────────────────────────────────┐ │
│ │ SERVICE LAYER │ │
│ │ (Business Logic - Validation, Processing) │ │
│ │ │ │
│ │ - AuthService - ProductService │ │
│ │ - UserService - BasketService │ │
│ │ - OrderService - RoleService │ │
│ └────────────────────┬─────────────────────────────────┘ │
│ │ │
│ ┌────────────────────▼─────────────────────────────────┐ │
│ │ REPOSITORY/DAO LAYER │ │
│ │ (Data Access - Database Operations) │ │
│ │ │ │
│ │ - UserRepository - ProductRepository │ │
│ │ - OrderRepository - BasketRepository │ │
│ │ - AddressRepository - BrandRepository │ │
│ │ - CategoryRepository - RoleRepository │ │
│ └────────────────────┬─────────────────────────────────┘ │
│ │ │
│ ┌────────────────────▼─────────────────────────────────┐ │
│ │ MODEL/ENTITY LAYER │ │
│ │ (Domain Objects - JPA Entities) │ │
│ │ │ │
│ │ - User, Product, Order, Basket, Address │ │
│ │ - Brand, Category, Role, OrderStatus │ │
│ └──────────────────────────────────────────────────────┘ │
└────────────────────────────┬───────────────────────────────┘
│
JPA/Hibernate
│
┌────────────────────────────▼───────────────────────────────┐
│ DATA TIER │
│ (PostgreSQL Database) │
│ │
│ Tables: users, products, orders, basket_items, │
│ addresses, brands, categories, roles │
└────────────────────────────────────────────────────────────┘

---

## Architecture Patterns

### 1. 3-Tier Architecture

The application follows a classic 3-tier architecture with clear separation of concerns:

#### **Presentation Tier (Frontend)**
- **Technology**: React.js with Redux for state management
- **Responsibilities**:
  - User interface rendering
  - User interaction handling
  - Client-side validation
  - State management
  - Routing and navigation
- **Communication**: HTTP REST API calls to the backend

#### **Application Tier (Backend)**
- **Technology**: Spring Boot (Java)
- **Responsibilities**:
  - Business logic processing
  - Data validation and transformation
  - Authentication and authorization
  - RESTful API endpoints
  - Transaction management
- **Communication**: 
  - Receives HTTP requests from frontend
  - Sends SQL queries to database via JPA

#### **Data Tier (Database)**
- **Technology**: PostgreSQL 16
- **Responsibilities**:
  - Data persistence
  - Data integrity enforcement
  - Complex queries and aggregations
  - Transaction support
- **Communication**: Accessed via JPA/Hibernate from backend

---

### 2. MVC Pattern (Backend)

The backend implements the **Model-View-Controller** pattern with clear separation:

#### **Model**
- JPA entities representing domain objects
- Examples: `User`, `Product`, `Order`, `Basket`, `Address`, `Brand`, `Category`, `Role`
- Contains data structure and relationships
- Mapped to database tables using JPA annotations

#### **View**
- RESTful JSON responses (DTOs)
- Separate DTOs for requests and responses
- Examples: `UserDTO`, `ProductDTO`, `OrderDTO`, `CreateUserRequest`, `CreateProductRequest`
- Prevents over-exposure of domain models

#### **Controller**
- REST controllers handling HTTP requests
- Examples: `UserController`, `ProductController`, `OrderController`, `BasketController`, `AuthController`
- Responsibilities:
  - Route HTTP requests to appropriate services
  - Validate input
  - Handle HTTP status codes
  - Transform service responses to JSON

---

### 3. Service Layer Pattern

Business logic is completely separated from controllers and data access:

Controller → Service → Repository → Database

**Service Layer Responsibilities**:
- Business rule enforcement
- Complex business logic
- Transaction management
- Orchestration between multiple repositories
- Data transformation (Entity ↔ DTO)

**Examples**:
- `AuthService`: JWT generation, password validation, user authentication
- `ProductService`: Inventory management, product filtering, stock validation
- `OrderService`: Order processing, price calculation, order validation
- `BasketService`: Cart management, item quantity validation
- `UserService`: User registration, profile updates, role management

---

### 4. Repository/DAO Pattern

Data access is abstracted through Spring Data JPA repositories:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```
Benefits:

Abstraction over database operations
Automatic query generation
Type-safe queries
Centralized data access
Easy to mock for testing
Repositories:

UserRepository
ProductRepository
OrderRepository
BasketRepository
AddressRepository
BrandRepository
CategoryRepository
RoleRepository
5. DTO Pattern
Data Transfer Objects provide clean API contracts:

Request DTOs:

@Data
public class CreateUserRequest {
    @NotBlank
    private String email;
    
    @NotBlank
    @Size(min = 8)
    private String password;
    
    @NotBlank
    private String firstName;
    
    @NotBlank
    private String lastName;
}

Response DTOs:

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    // No password field for security
}

Benefits:

API versioning support
Security (hide sensitive fields)
Validation at API boundary
Decoupling from database schema

Complete Decoupling
The frontend and backend are completely independent applications with no direct dependencies:

