# Kuik

Team Members
- Yuriy Kotyashko
- Stefewn Johnson
- Daniel Chahine
- Muhammad Zamin

Overview
This repo contains a full-stack eCommerce application with a Spring Boot backend and a React + Vite frontend. The backend exposes REST APIs for authentication, users, roles, products, basket, and orders. The frontend consumes those APIs, manages global state with Redux, and provides guest and authenticated shopping flows.

Repository Layout
- backend/
  - src/main/java/com/example/
    - config/: Spring config (security, CORS, data initialization)
    - controller/: REST controllers for auth, users, roles, products, basket, orders
    - dto/: request/response models used by the API layer
    - exception/: custom exceptions + global handler
    - model/: JPA entities
    - repository/: Spring Data JPA repositories
    - security/: JWT filter/entrypoint/service
    - service/: business logic
  - src/main/resources/
    - application.yml: local dev config
    - application-docker.yml: docker profile config
    - application.properties.h2-backup: H2 in-memory backup config
    - db/migration/: Flyway migration templates and sample data
  - docker-compose.yml: Postgres + backend service
  - Dockerfile: multi-stage Spring Boot image build
  - http endpoints/: REST Client .http files for API testing
- frontend/
  - src/
    - api/: fetch wrapper with auth token + caching
    - components/: Navbar/Footer, route guards, cache widget
    - components/ui/: shadcn/ui + Radix UI primitives
    - context/: auth context provider
    - pages/: UI screens/routes
    - redux/: slices for auth, products, basket, orders, users
    - utils/: likes (wishlist) local storage helpers
  - Dockerfile: Node dev container
  - vite.config.js: Vite + Tailwind plugin + alias config
  - components.json: shadcn/ui config (style, aliases, icons)

Tech Stack
- Backend: Spring Boot 4.0.0, Java 17, Spring Web, Spring Data JPA, Spring Validation, Spring Security
- Auth: JWT (jjwt 0.12.5), BCrypt password hashing
- Database: PostgreSQL 16 (Docker), Flyway (optional), H2 backup config
- Frontend: React 19, Vite 7, React Router 7, Redux 5 + Thunk
- UI: Tailwind CSS v4, shadcn/ui + Radix UI, lucide-react icons
- Tooling: ESLint, Node 20 (Docker image), Maven wrapper

How to Run
Prerequisites
- Java 17
- Docker (for Postgres and optional backend container)
- Node 20+ (if running frontend locally without Docker)

Backend (Docker Compose)
1. From repo root:
   - cd backend
2. Build and start Postgres + backend:
   - docker-compose up --build
3. Backend runs on http://localhost:8080 (APP_PORT if overridden)
4. Postgres runs on localhost:5332 (DB_PORT if overridden)

Backend (Local JVM + Docker Postgres)
1. Start Postgres only:
   - cd backend
   - docker-compose up db -d
2. Run Spring Boot:
   - ./mvnw spring-boot:run

Frontend (Local)
1. cd frontend
2. npm install
3. npm run dev
4. Frontend runs on http://localhost:5173

Frontend (Docker)
1. cd frontend
2. docker build -t estore-frontend .
3. docker run -p 5173:5173 estore-frontend

Configuration and Environment
Backend application.yml (local profile)
- server.port: 8080
- spring.datasource.url: jdbc:postgresql://localhost:5332/postgres
- spring.datasource.username: daniel
- spring.datasource.password: password
- spring.jpa.hibernate.ddl-auto: update
- spring.jpa.show-sql: true
- spring.flyway.enabled: false
- jwt.secret: base64 secret (env override JWT_SECRET)
- jwt.expiration: 86400000 ms (env override JWT_EXPIRATION)

Backend application-docker.yml (docker profile)
- spring.datasource.url uses DB_HOST, DB_PORT, DB_NAME
- spring.jpa.hibernate.ddl-auto: ${DDL_AUTO:update}
- spring.flyway.enabled: ${FLYWAY_ENABLED:false}
- server.port: ${SERVER_PORT:8080}

docker-compose.yml environment variables
- DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
- JWT_SECRET, JWT_EXPIRATION
- DDL_AUTO, FLYWAY_ENABLED
- APP_PORT (backend)

Frontend environment variables (Vite)
- VITE_API_BASE_URL: overrides backend base URL (default http://localhost:8080)
- VITE_DEVELOPMENT: if "production", uses http://localhost:8080
- VITE_DEBUG_API: set "true" to log request/response details

Backend Architecture
Packages
- controller: REST endpoints
- service: business logic
- repository: JPA data access
- model: JPA entities
- dto: request/response models
- security: JWT generation + filter + entry point
- config: Spring Security, CORS, sample data
- exception: typed exceptions + global handler

Entities (JPA Models)
- User: id, username, email, password, role, phoneNumber, address
  - Many-to-one Role, one-to-one Address
- Role: id, name, description
- Address: id, zip, country, street, province
- Product: id, name, quantity, price, description, image, brand, category
  - Many-to-one Brand, Many-to-one Category
- Brand: id, name
- Category: id, name
- Basket: id, user, product, quantity
  - Many-to-one User, Many-to-one Product
- Order: id, user (nullable for guest), address, status, total, timeCreated, basket (simplified)
- OrderStatus: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED

Sample Data Initialization
DataInitializer seeds the database when there is no data:
- Roles: ROLE_ADMIN, ROLE_USER, ROLE_GUEST
- Categories and Brands: Electronics, Clothing, Books, Home & Garden, Sports & Outdoors, Toys & Games, Food & Beverages, Health & Beauty, plus brands such as TechMaster and FashionHub
- Addresses: 5 sample Canadian addresses
- Users: admin, john_doe, jane_smith, bob_wilson, guest_user (password: password123)
- Products: sample items across categories with Unsplash image URLs

Security
- JWT-based stateless auth
- Password hashing with BCrypt
- JwtAuthenticationFilter validates tokens for /api/** (except /api/auth/**)
- JwtAuthenticationEntryPoint returns JSON error payload on 401
- CustomUserDetailsService loads users by email and maps role to Spring authorities
- SecurityConfig rules:
  - /api/auth/**, /h2-console/**, /api/products/** are public
  - /api/orders (root path) allows guest checkout
  - All other /api/** require JWT

Error Handling
GlobalExceptionHandler returns ErrorResponse with:
- timestamp, status, error, message, path
- validationErrors map for request validation failures
Exceptions:
- ResourceNotFoundException (404)
- DuplicateResourceException (409)
- InvalidOperationException (400)
- InsufficientStockException (400)

Backend Services (Business Logic)
- AuthService: registration with role lookup, optional address, password encoding
- UserService: CRUD, unique email/username checks, address create/update
- RoleService: CRUD with unique name guard
- ProductService: CRUD, search/filter, availability checks, brand/category validation
- BasketService: add/update/remove/clear, stock checks, merge existing items
- OrderService:
  - Authenticated orders: uses basket items, reduces stock, clears basket
  - Guest orders: requires guestEmail + guestAddress + items
  - Status transitions with validation (cannot change CANCELLED/DELIVERED)

API Reference (Backend)
Base URL: http://localhost:8080

Authentication
- POST /api/auth/login
  - Body: LoginRequest { email, password }
  - Response: LoginResponse { token, type, user }
- POST /api/auth/register
  - Body: RegisterRequest { username, email, password, roleId, phoneNumber?, address? }
  - Response: LoginResponse
- GET /api/auth/validate
  - Header: Authorization: Bearer <token>
  - Response: UserDTO

Users
- POST /api/users
  - Body: CreateUserRequest { username, email, password, roleId, phoneNumber?, address? }
  - Response: UserDTO
- GET /api/users/{id}
- GET /api/users/email/{email}
- GET /api/users
- GET /api/users/role/{roleId}
- PUT /api/users/{id}
  - Body: UpdateUserRequest { username, email, password?, roleId, phoneNumber?, address? }
- DELETE /api/users/{id}

Roles
- POST /api/roles
  - Body: CreateRoleRequest { name, description? }
- GET /api/roles
- GET /api/roles/{id}
- GET /api/roles/name/{name}
- PUT /api/roles/{id}
- DELETE /api/roles/{id}

Products
- POST /api/products
  - Body: CreateProductRequest { name, quantity, price, description?, image?, brandId, categoryId }
- GET /api/products
  - Query: availableOnly (optional)
- GET /api/products/{id}
- GET /api/products/brand/{brandId}
- GET /api/products/category/{categoryId}
- GET /api/products/search?name=...
- GET /api/products/filter?brandId=&categoryId=
- PUT /api/products/{id}
- PATCH /api/products/{id}/quantity?quantity=
- DELETE /api/products/{id}

Basket
- POST /api/basket
  - Body: AddToBasketRequest { userId, productId, quantity }
- GET /api/basket/user/{userId}
- GET /api/basket/user/{userId}/count
- PATCH /api/basket/{basketItemId}?quantity=
- DELETE /api/basket/{basketItemId}
- DELETE /api/basket/user/{userId}

Orders
- POST /api/orders
  - Authenticated: { userId, addressId }
  - Guest: { guestEmail, guestAddress, items: [ { productId, quantity, price } ] }
- GET /api/orders
- GET /api/orders/{id}
- GET /api/orders/user/{userId}
- GET /api/orders/status/{status}
- PATCH /api/orders/{id}/status?status=
- DELETE /api/orders/{id}

Testing and API Utilities
- backend/http endpoints/*.http: REST Client files with sample payloads
- API_DOCUMENTATION.md: additional API details

Frontend Architecture
App Shell and Routing
- App.jsx wraps AuthProvider + Redux initializer
- Lazy-loaded routes:
  - /: Catalog (trending products + category cards)
  - /search/:name: Search with filters (price, category, brand, stock)
  - /product/:id: Product details and add to cart
  - /cart: Basket (guest or authenticated)
  - /checkout: Checkout (guest or authenticated)
  - /thank-you: Order confirmation + auto redirect
  - /login, /register
  - /profile, /orders (UserRoute protected)
  - /admin (AdminRoute protected: role id === 1)
  - /likes: liked products

State Management (Redux)
- auth: token + user for login/register
- products: product list, product details, search results
- basket:
  - server basket for logged-in users
  - localStorage basket for guests (key: guestBasket)
  - mergeLocalBasketWithServer on login
- orders: order list + status updates
- users: user list + profile updates (admin)

Auth Context
- AuthProvider stores user + token in localStorage
- Validates token via /api/auth/validate on boot
- Exposes login, logout, loading state

API Layer (frontend/src/api/api.js)
- Base URL from Vite env (VITE_API_BASE_URL)
- JWT auto-added to Authorization header
- GET caching in memory + localStorage:
  - TTL 5 minutes, max 50 entries
  - Cache invalidation on mutations
- DEBUG mode via VITE_DEBUG_API

Likes (Wishlist)
- Local storage per user id or guest:
  - Key: likedProducts:<userId> or likedProducts:guest
- Toggle and read functions in frontend/src/utils/likes.js

UI Components
- Navbar: search bar, cart count, auth menu, likes, guest vs user actions
- Footer: site navigation and admin links
- AdminRoute/UserRoute: route guards
- CacheStatus: optional cache widget to clear API cache

Admin Dashboard
- Sales tab: list orders with status updates
- Inventory tab: list products + quantity patch; add product dialog
- Users tab: list users; edit user details (role, address, phone)

Frontend Styling
- Tailwind CSS v4 with CSS variables (src/index.css)
- shadcn/ui style: "new-york" (components.json)

Docker Notes
Backend
- Multi-stage Dockerfile builds jar with Maven, runs on JRE 17
- Non-root user for runtime image

Frontend
- Dockerfile uses node:20-alpine
- Runs Vite dev server on 0.0.0.0:5173

Database and Migrations
- Flyway templates in backend/src/main/resources/db/migration/
  - V1__initial_schema_template.sql.example: placeholder for schema
  - V2__insert_sample_data.sql: sample seed data
- fix_user_id_constraint.sql: allows NULL user_id for guest orders

Notes
- Guest checkout: allowed for /api/orders POST with guestEmail + guestAddress + items
- Inventory checks happen on basket add/update and order creation
- Basket is cleared after successful order for authenticated users
