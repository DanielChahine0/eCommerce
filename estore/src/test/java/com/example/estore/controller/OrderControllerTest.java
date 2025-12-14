package com.example.estore.controller;

import com.example.estore.dto.*;
import com.example.estore.model.OrderStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for OrderController
 * Tests order management including checkout, status updates, and cancellation
 */
@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class OrderControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private ObjectMapper objectMapper;

    private UserDTO testUser;
    private ProductDTO testProduct;
    private Integer addressId;

    @BeforeEach
    void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        
        // Create test user with address
        CreateAddressRequest address = new CreateAddressRequest();
        address.setZip("12345");
        address.setCountry("USA");
        address.setStreet("123 Main St");
        address.setProvince("CA");

        CreateUserRequest userRequest = new CreateUserRequest();
        userRequest.setUsername("order_user");
        userRequest.setEmail("order@example.com");
        userRequest.setRole("customer");
        userRequest.setAddress(address);

        String userResponse = mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(userRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        testUser = objectMapper.readValue(userResponse, UserDTO.class);
        addressId = testUser.getAddress().getId();

        // Create test product
        CreateProductRequest productRequest = new CreateProductRequest();
        productRequest.setName("Order Test Product");
        productRequest.setDescription("Product for order testing");
        productRequest.setQuantity(100);
        productRequest.setBrandId(1);
        productRequest.setCategoryId(1);

        String productResponse = mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        testProduct = objectMapper.readValue(productResponse, ProductDTO.class);
    }

    @Test
    void testCreateOrder_Success() throws Exception {
        // Add item to basket
        AddToBasketRequest basketRequest = new AddToBasketRequest();
        basketRequest.setUserId(testUser.getId());
        basketRequest.setProductId(testProduct.getId());
        basketRequest.setQuantity(5);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(basketRequest)))
                .andExpect(status().isCreated());

        // Create order
        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(testUser.getId());
        orderRequest.setAddressId(addressId);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.userId").value(testUser.getId()))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].quantity").value(5));

        // Verify basket is cleared
        mockMvc.perform(get("/api/basket/user/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        // Verify inventory reduced
        mockMvc.perform(get("/api/products/" + testProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(95));
    }

    @Test
    void testCreateOrder_EmptyBasket() throws Exception {
        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(testUser.getId());
        orderRequest.setAddressId(addressId);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("empty")));
    }

    @Test
    void testCreateOrder_InsufficientStock() throws Exception {
        // Add more items to basket than available stock
        AddToBasketRequest basketRequest = new AddToBasketRequest();
        basketRequest.setUserId(testUser.getId());
        basketRequest.setProductId(testProduct.getId());
        basketRequest.setQuantity(50);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(basketRequest)))
                .andExpect(status().isCreated());

        // Reduce product stock
        mockMvc.perform(patch("/api/products/" + testProduct.getId() + "/quantity")
                .param("quantity", "30"))
                .andExpect(status().isOk());

        // Try to create order - should fail
        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(testUser.getId());
        orderRequest.setAddressId(addressId);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("stock")));
    }

    @Test
    void testGetOrderById_Success() throws Exception {
        // Create order
        AddToBasketRequest basketRequest = new AddToBasketRequest();
        basketRequest.setUserId(testUser.getId());
        basketRequest.setProductId(testProduct.getId());
        basketRequest.setQuantity(5);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(basketRequest)))
                .andExpect(status().isCreated());

        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(testUser.getId());
        orderRequest.setAddressId(addressId);

        String response = mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        OrderDTO createdOrder = objectMapper.readValue(response, OrderDTO.class);

        // Get order by ID
        mockMvc.perform(get("/api/orders/" + createdOrder.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdOrder.getId()))
                .andExpect(jsonPath("$.userId").value(testUser.getId()));
    }

    @Test
    void testGetOrderById_NotFound() throws Exception {
        mockMvc.perform(get("/api/orders/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetUserOrders_Success() throws Exception {
        // Create order
        AddToBasketRequest basketRequest = new AddToBasketRequest();
        basketRequest.setUserId(testUser.getId());
        basketRequest.setProductId(testProduct.getId());
        basketRequest.setQuantity(5);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(basketRequest)))
                .andExpect(status().isCreated());

        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(testUser.getId());
        orderRequest.setAddressId(addressId);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isCreated());

        // Get user orders
        mockMvc.perform(get("/api/orders/user/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].userId").value(testUser.getId()));
    }

    @Test
    void testGetOrdersByStatus_Success() throws Exception {
        // Create order
        AddToBasketRequest basketRequest = new AddToBasketRequest();
        basketRequest.setUserId(testUser.getId());
        basketRequest.setProductId(testProduct.getId());
        basketRequest.setQuantity(5);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(basketRequest)))
                .andExpect(status().isCreated());

        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(testUser.getId());
        orderRequest.setAddressId(addressId);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isCreated());

        // Get orders by status
        mockMvc.perform(get("/api/orders/status/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void testUpdateOrderStatus_Success() throws Exception {
        // Create order
        AddToBasketRequest basketRequest = new AddToBasketRequest();
        basketRequest.setUserId(testUser.getId());
        basketRequest.setProductId(testProduct.getId());
        basketRequest.setQuantity(5);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(basketRequest)))
                .andExpect(status().isCreated());

        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(testUser.getId());
        orderRequest.setAddressId(addressId);

        String response = mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        OrderDTO createdOrder = objectMapper.readValue(response, OrderDTO.class);

        // Update order status
        mockMvc.perform(patch("/api/orders/" + createdOrder.getId() + "/status")
                .param("status", "SHIPPED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SHIPPED"));
    }

    @Test
    void testCancelOrder_Success() throws Exception {
        // Create order
        AddToBasketRequest basketRequest = new AddToBasketRequest();
        basketRequest.setUserId(testUser.getId());
        basketRequest.setProductId(testProduct.getId());
        basketRequest.setQuantity(5);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(basketRequest)))
                .andExpect(status().isCreated());

        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(testUser.getId());
        orderRequest.setAddressId(addressId);

        String response = mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        OrderDTO createdOrder = objectMapper.readValue(response, OrderDTO.class);

        // Cancel order
        mockMvc.perform(delete("/api/orders/" + createdOrder.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));

        // Verify inventory restored
        mockMvc.perform(get("/api/products/" + testProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(100)); // Back to original
    }

    @Test
    void testGetAllOrders_Success() throws Exception {
        // Create order
        AddToBasketRequest basketRequest = new AddToBasketRequest();
        basketRequest.setUserId(testUser.getId());
        basketRequest.setProductId(testProduct.getId());
        basketRequest.setQuantity(5);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(basketRequest)))
                .andExpect(status().isCreated());

        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(testUser.getId());
        orderRequest.setAddressId(addressId);

        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isCreated());

        // Get all orders
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }
}
