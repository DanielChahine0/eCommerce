# Test Suite Documentation

## Overview
This test suite provides comprehensive coverage for the eCommerce backend application, testing all major components and business logic.

## Test Structure

### Integration Tests (Controller Layer)
Located in `src/test/java/com/example/estore/controller/`

1. **UserControllerTest.java**
   - Tests all user management endpoints
   - Validates user creation, retrieval, update, and deletion
   - Tests duplicate email/username prevention
   - Tests input validation

2. **ProductControllerTest.java**
   - Tests product catalog management
   - Validates CRUD operations
   - Tests search and filtering functionality
   - Tests inventory management
   - Validates stock constraints

3. **BasketControllerTest.java**
   - Tests shopping cart functionality
   - Validates add to cart with stock checking
   - Tests quantity updates and merging
   - Tests basket clearing
   - Validates stock availability constraints

4. **OrderControllerTest.java**
   - Tests order creation and management
   - Validates checkout process
   - Tests inventory reduction on order
   - Tests order status transitions
   - Tests order cancellation with inventory restoration

### Unit Tests (Service Layer)
Located in `src/test/java/com/example/estore/service/`

1. **UserServiceTest.java**
   - Tests user service business logic
   - Validates duplicate prevention
   - Tests error scenarios

## Running the Tests

### Run All Tests
```bash
cd estore
mvn test
```

### Run Specific Test Class
```bash
mvn test -Dtest=UserControllerTest
mvn test -Dtest=ProductControllerTest
mvn test -Dtest=BasketControllerTest
mvn test -Dtest=OrderControllerTest
```

### Run Tests with Coverage
```bash
mvn test jacoco:report
```

### Run Tests in IDE
- **IntelliJ IDEA**: Right-click on test class → Run
- **Eclipse**: Right-click on test class → Run As → JUnit Test
- **VS Code**: Click the play button next to test methods

## Test Coverage

### User Management ✅
- Create user with address
- Get user by ID
- Get user by email
- Update user
- Delete user
- Get all users
- Duplicate email validation
- Duplicate username validation
- Invalid email format validation

### Product Catalog ✅
- Create product
- Get product by ID
- Get all products
- Get available products only
- Filter by brand
- Filter by category
- Search by name
- Update product
- Update product quantity
- Delete product
- Invalid quantity validation
- Invalid brand/category validation

### Shopping Cart ✅
- Add to basket
- Add exceeding stock (validation)
- Get user basket
- Update basket item quantity
- Remove from basket
- Clear basket
- Merge quantities for same product
- Stock validation on add/update

### Order Management ✅
- Create order (checkout)
- Get order by ID
- Get user orders
- Get orders by status
- Update order status
- Cancel order
- Empty basket validation
- Insufficient stock validation
- Inventory reduction on order
- Inventory restoration on cancellation

## Test Data
Each test creates its own test data using:
- `@BeforeEach` setup methods
- Factory methods for DTOs
- In-memory H2 database (reset between tests)
- `@DirtiesContext` to ensure clean state

## Assertions Used
- Status code validation (201, 200, 404, 400, 409)
- JSON path assertions for response body
- Exception type assertions
- Business rule validations

## Technologies Used
- **JUnit 5**: Test framework
- **Spring Boot Test**: Integration testing support
- **MockMvc**: REST API testing
- **Jackson**: JSON serialization
- **Hamcrest**: Matchers for assertions
- **H2 Database**: In-memory test database

## Best Practices Followed
1. ✅ Each test is independent
2. ✅ Tests clean up after themselves
3. ✅ Clear test naming (testMethodName_Scenario)
4. ✅ Comprehensive edge case coverage
5. ✅ Both positive and negative test cases
6. ✅ Integration and unit test separation
7. ✅ Realistic test data
8. ✅ Proper use of assertions

## Adding New Tests

### Controller Test Template
```java
@Test
void testMethodName_Scenario() throws Exception {
    // Arrange - setup test data
    
    // Act - perform the action
    mockMvc.perform(...)
        
    // Assert - verify results
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.field").value("value"));
}
```

### Service Test Template
```java
@Test
void testMethodName_Scenario() {
    // Arrange
    
    // Act
    var result = service.method();
    
    // Assert
    assertNotNull(result);
    assertEquals(expected, result);
}
```

## Continuous Integration
These tests can be integrated into CI/CD pipelines:
- GitHub Actions
- Jenkins
- GitLab CI
- Travis CI

Example GitHub Actions:
```yaml
- name: Run tests
  run: mvn test
```

## Coverage Goals
- **Line Coverage**: > 80%
- **Branch Coverage**: > 70%
- **Method Coverage**: > 85%

## Known Limitations
1. Authentication/Authorization not tested (not implemented)
2. Performance tests not included
3. Load tests not included
4. Database migration tests not included

## Future Enhancements
- [ ] Add security tests when authentication is implemented
- [ ] Add performance/load tests
- [ ] Add API documentation tests (OpenAPI/Swagger)
- [ ] Add database integration tests with real database
- [ ] Add end-to-end tests with front-end
- [ ] Add contract tests for API versioning

## Troubleshooting

### Tests failing to start
- Ensure H2 database dependency is in pom.xml
- Check application.properties for test profile

### Random test failures
- Check for test isolation issues
- Verify @DirtiesContext is used properly

### Slow tests
- Consider using @Transactional for faster rollback
- Use test slices (@WebMvcTest) for faster controller tests

## Contact
For questions or issues with tests, please contact the development team.
