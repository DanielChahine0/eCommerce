package com.example.estore.controller;

import com.example.estore.dto.*;
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
 * Integration tests for BasketController
 * Tests shopping cart functionality including add, update, remove, and clear
 */
@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class BasketControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private ObjectMapper objectMapper;

    private UserDTO testUser;
    private ProductDTO testProduct;

    @BeforeEach
    void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        
        // Create test user
        CreateAddressRequest address = new CreateAddressRequest();
        address.setZip("12345");
        address.setCountry("USA");
        address.setStreet("123 Main St");
        address.setProvince("CA");

        CreateUserRequest userRequest = new CreateUserRequest();
        userRequest.setUsername("basket_user");
        userRequest.setEmail("basket@example.com");
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

        // Create test product
        CreateProductRequest productRequest = new CreateProductRequest();
        productRequest.setName("Test Product");
        productRequest.setDescription("Test Description");
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
    void testAddToBasket_Success() throws Exception {
        AddToBasketRequest request = new AddToBasketRequest();
        request.setUserId(testUser.getId());
        request.setProductId(testProduct.getId());
        request.setQuantity(5);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.userId").value(testUser.getId()))
                .andExpect(jsonPath("$.productId").value(testProduct.getId()))
                .andExpect(jsonPath("$.quantity").value(5));
    }

    @Test
    void testAddToBasket_ExceedsStock() throws Exception {
        AddToBasketRequest request = new AddToBasketRequest();
        request.setUserId(testUser.getId());
        request.setProductId(testProduct.getId());
        request.setQuantity(150); // More than available stock

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("stock")));
    }

    @Test
    void testAddToBasket_InvalidQuantity() throws Exception {
        AddToBasketRequest request = new AddToBasketRequest();
        request.setUserId(testUser.getId());
        request.setProductId(testProduct.getId());
        request.setQuantity(0);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAddToBasket_ProductNotFound() throws Exception {
        AddToBasketRequest request = new AddToBasketRequest();
        request.setUserId(testUser.getId());
        request.setProductId(9999);
        request.setQuantity(1);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testAddToBasket_MergeQuantity() throws Exception {
        // Add product to basket
        AddToBasketRequest request = new AddToBasketRequest();
        request.setUserId(testUser.getId());
        request.setProductId(testProduct.getId());
        request.setQuantity(5);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Add same product again - should merge quantities
        request.setQuantity(3);
        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.quantity").value(8));
    }

    @Test
    void testGetUserBasket_Success() throws Exception {
        // Add item to basket
        AddToBasketRequest request = new AddToBasketRequest();
        request.setUserId(testUser.getId());
        request.setProductId(testProduct.getId());
        request.setQuantity(5);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Get basket
        mockMvc.perform(get("/api/basket/user/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].quantity").value(5));
    }

    @Test
    void testGetUserBasket_Empty() throws Exception {
        mockMvc.perform(get("/api/basket/user/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void testUpdateBasketItemQuantity_Success() throws Exception {
        // Add item to basket
        AddToBasketRequest request = new AddToBasketRequest();
        request.setUserId(testUser.getId());
        request.setProductId(testProduct.getId());
        request.setQuantity(5);

        String response = mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        BasketItemDTO basketItem = objectMapper.readValue(response, BasketItemDTO.class);

        // Update quantity
        mockMvc.perform(patch("/api/basket/" + basketItem.getId())
                .param("quantity", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(10));
    }

    @Test
    void testUpdateBasketItemQuantity_ExceedsStock() throws Exception {
        // Add item to basket
        AddToBasketRequest request = new AddToBasketRequest();
        request.setUserId(testUser.getId());
        request.setProductId(testProduct.getId());
        request.setQuantity(5);

        String response = mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        BasketItemDTO basketItem = objectMapper.readValue(response, BasketItemDTO.class);

        // Try to update to quantity exceeding stock
        mockMvc.perform(patch("/api/basket/" + basketItem.getId())
                .param("quantity", "150"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("stock")));
    }

    @Test
    void testRemoveFromBasket_Success() throws Exception {
        // Add item to basket
        AddToBasketRequest request = new AddToBasketRequest();
        request.setUserId(testUser.getId());
        request.setProductId(testProduct.getId());
        request.setQuantity(5);

        String response = mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        BasketItemDTO basketItem = objectMapper.readValue(response, BasketItemDTO.class);

        // Remove item
        mockMvc.perform(delete("/api/basket/" + basketItem.getId()))
                .andExpect(status().isNoContent());

        // Verify basket is empty
        mockMvc.perform(get("/api/basket/user/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void testClearBasket_Success() throws Exception {
        // Add multiple items to basket
        AddToBasketRequest request1 = new AddToBasketRequest();
        request1.setUserId(testUser.getId());
        request1.setProductId(testProduct.getId());
        request1.setQuantity(5);

        mockMvc.perform(post("/api/basket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        // Clear basket
        mockMvc.perform(delete("/api/basket/user/" + testUser.getId()))
                .andExpect(status().isNoContent());

        // Verify basket is empty
        mockMvc.perform(get("/api/basket/user/" + testUser.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }
}
