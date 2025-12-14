package com.example.estore.controller;

import com.example.estore.dto.CreateProductRequest;
import com.example.estore.dto.ProductDTO;
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
 * Integration tests for ProductController
 * Tests product catalog management including CRUD, search, and filtering
 */
@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ProductControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private ObjectMapper objectMapper;

    private CreateProductRequest validProductRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
        
        validProductRequest = new CreateProductRequest();
        validProductRequest.setName("iPhone 15");
        validProductRequest.setDescription("Latest Apple smartphone");
        validProductRequest.setQuantity(50);
        validProductRequest.setBrandId(1); // Assuming brand with ID 1 exists from DataInitializer
        validProductRequest.setCategoryId(1); // Assuming category with ID 1 exists
    }

    @Test
    void testCreateProduct_Success() throws Exception {
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("iPhone 15"))
                .andExpect(jsonPath("$.description").value("Latest Apple smartphone"))
                .andExpect(jsonPath("$.quantity").value(50));
    }

    @Test
    void testCreateProduct_InvalidQuantity() throws Exception {
        validProductRequest.setQuantity(-5);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("negative")));
    }

    @Test
    void testCreateProduct_MissingName() throws Exception {
        validProductRequest.setName(null);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCreateProduct_InvalidBrand() throws Exception {
        validProductRequest.setBrandId(9999);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("Brand")));
    }

    @Test
    void testGetProductById_Success() throws Exception {
        // Create product first
        String response = mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ProductDTO createdProduct = objectMapper.readValue(response, ProductDTO.class);

        // Get product by ID
        mockMvc.perform(get("/api/products/" + createdProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdProduct.getId()))
                .andExpect(jsonPath("$.name").value("iPhone 15"));
    }

    @Test
    void testGetProductById_NotFound() throws Exception {
        mockMvc.perform(get("/api/products/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAllProducts_Success() throws Exception {
        // Create multiple products
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated());

        validProductRequest.setName("Samsung Galaxy");
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated());

        // Get all products
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))));
    }

    @Test
    void testGetAvailableProducts_OnlyInStock() throws Exception {
        // Create in-stock product
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated());

        // Create out-of-stock product
        validProductRequest.setName("Out of Stock Product");
        validProductRequest.setQuantity(0);
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated());

        // Get only available products
        mockMvc.perform(get("/api/products?availableOnly=true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].quantity", everyItem(greaterThan(0))));
    }

    @Test
    void testGetProductsByBrand_Success() throws Exception {
        // Create product
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated());

        // Get products by brand
        mockMvc.perform(get("/api/products/brand/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void testGetProductsByCategory_Success() throws Exception {
        // Create product
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated());

        // Get products by category
        mockMvc.perform(get("/api/products/category/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    void testSearchProducts_Success() throws Exception {
        // Create product
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated());

        // Search by name
        mockMvc.perform(get("/api/products/search?name=iPhone"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name", containsString("iPhone")));
    }

    @Test
    void testUpdateProduct_Success() throws Exception {
        // Create product first
        String response = mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ProductDTO createdProduct = objectMapper.readValue(response, ProductDTO.class);

        // Update product
        validProductRequest.setName("iPhone 15 Pro");
        validProductRequest.setQuantity(100);

        mockMvc.perform(put("/api/products/" + createdProduct.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("iPhone 15 Pro"))
                .andExpect(jsonPath("$.quantity").value(100));
    }

    @Test
    void testUpdateProductQuantity_Success() throws Exception {
        // Create product first
        String response = mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ProductDTO createdProduct = objectMapper.readValue(response, ProductDTO.class);

        // Update quantity
        mockMvc.perform(patch("/api/products/" + createdProduct.getId() + "/quantity")
                .param("quantity", "75"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(75));
    }

    @Test
    void testDeleteProduct_Success() throws Exception {
        // Create product first
        String response = mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validProductRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        ProductDTO createdProduct = objectMapper.readValue(response, ProductDTO.class);

        // Delete product
        mockMvc.perform(delete("/api/products/" + createdProduct.getId()))
                .andExpect(status().isNoContent());

        // Verify deletion
        mockMvc.perform(get("/api/products/" + createdProduct.getId()))
                .andExpect(status().isNotFound());
    }
}
