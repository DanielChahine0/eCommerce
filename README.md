# eCommerce Website

# Team Members:
- Yuriy Kotyashko 
- Stefewn Johnson 
- Daniel Chahine
- Muhammad Zamin

# How to run
## Prerequisites
If you want to run the project locally, ensure you have the following installed:
- Java Development Kit (JDK) 11 or higher.
- Docker installed on your machine.

## Steps to Run
1. Clone the repository:
```bash
   git clone https://github.com/DanielChahine0/ecommerce.git
```

**Backend**
2. Navigate to the backend directory:
```bash
   cd ecommerce/backend
```
3. Build and run the Docker containers:
```bash
   docker-compose up --build
```
This will set up the PostgreSQL database and the Spring Boot application.

**Frontend**
4. Open a new terminal window and navigate to the frontend directory:
```bash
   cd ecommerce/frontend
```

5. Install the necessary dependencies:
```bash
   npm install
```

6. Start the React development server:
```bash
   npm run dev
```

# Basic Functionalities
## User Functionalities
- Registration: Users can create an account by providing necessary details such as username, email, password, and address.
- Sign In: Registered users can log in using their email and password.
- Sign Out: Users can securely log out of their accounts.
- List catalogue items: Users can browse through a list of available products with details such as name, price, and description.
- Filter cataglogue items: Users can filter products based on categories, price range, and other attributes.
- Add items to cart: Users can add selected products to their shopping cart for purchase.
- View cart: Users can view the contents of their shopping cart, including product details and total price.
- Remove items from cart: Users can remove unwanted items from their shopping cart.
- Maintain Profile: Users can update their personal information, including name, email, password, and address.

## Admin Functionalities
- Sign In: Admins can log in using their admin credentials.
- Maintain Sales History: Admins can view and manage the sales history, including order details and customer information.
- Maintain Inventory: Admins can add, update, or remove products from the inventory.
- Maintain Users: Admins can manage user accounts, including viewing user details and deleting accounts if necessary.

# Development and Framework
- Frontend: React.js
- Backend: Spring Boot
- Database: PostgreSQL
- Version Control: Git and GitHub
- Deployment: Docker and Render.com
- Testing: Postman for API testing

## Design & Implementation
- Figma: Used for designing the user interface and user experience of the eCommerce website.
- DB Diagram: Created to visualize the database structure and relationships between different entities.
- Clear Architecture: Followed best practices for software architecture to ensure maintainability and scalability of the application.
- Clear Separation between Backend and Frontend: Ensured that the frontend and backend components are decoupled for better development and deployment processes.
- MVC Architecture (backend): Implemented the Model-View-Controller architecture to separate concerns and improve code organization.
- DAO Pattern (backend): Used the Data Access Object pattern to abstract and encapsulate all access to the data source.
- DTO Pattern (backend): Employed Data Transfer Objects to transfer data between the client and server efficiently.
- Service Layer (backend): Created a service layer to handle business logic and interact with the data access layer.
- RESTful APIs (backend): Developed RESTful APIs to enable communication between the frontend and backend.
- React Components (frontend): Built reusable React components for the user interface.
- React Hooks (frontend): Utilized React Hooks for managing state and side effects in functional components.
- Testcases: Test cases using http requests as files in the `http endpoints` folder for backend API testing with Postman.
- GitHub Repository: [eCommerce Website Repository](https://github.com/DanielChahine0/ecommerce)

## Backend & Model Services
- Data Access: DAO classes with DTO classes for data transfer.
- Services:
  - Catalogue (Product): Manage product listings, filtering, and inventory.
  - Order: Handle order creation, processing, and sales history.
  - Roles: Manage user roles and permissions.
  - Users: Handle user registration, authentication, and profile management.
  - Authentication: Manage user login and security.
  - Basket: Handle shopping cart functionalities.

## Web APIs
- CatalogueController: Endpoints for product listing and filtering.
- OrderController: Endpoints for order management and sales history.
- RolesController: Endpoints for managing user roles.
- UsersController: Endpoints for user registration, authentication, and profile management.
- AuthController: Endpoints for user login and security.
- BasketController: Endpoints for shopping cart functionalities.

## Frontend Components
- Catalogue Components: Components for displaying and filtering product listings.
- Order Components: Components for managing orders and viewing sales history.
- Checkout Components: Components for handling the checkout process.
- Shopping Cart Components: Components for managing the shopping cart.
- Registration & Login Components: Components for user registration and authentication. Includes **Authentication Components**.
- Admin Components: Components for admin functionalities such as inventory and user management.

# Other Features
- Allowing users to checkout without the need to create an account.
- All of our web services follow RESTful API design principles.
- Used technologies outside of class: react for frontend, spring boot for backend, docker, JWT. 
- Security:
  - Passwords are hashed using BCrypt before storing in the database.
  - JSON Web Tokens (JWT) are used for secure authentication and authorization.
  - Java Spring Security is implemented to protect backend endpoints.
  - SQL Injection are prevented by JPA Repository methods.
- After loggin in, items are retained in the shopping cart for users. 
- Maintain a wishlist (liked items) for users.
- Admin view: Admins can add new items with quantities, associated photos, brand, and category. Admins can change the image of an existing product. 


# Team Development & Deployment Process
- Render.com: Used for deploying the backend applications (tried to do frontend but got blocked by CORS).
- Docker: Used for containerizing the backend and database services for consistent deployment. Can be run on different macehines.