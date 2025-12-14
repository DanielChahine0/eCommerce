package com.example.estore.service;

import com.example.estore.dto.CreateAddressRequest;
import com.example.estore.dto.CreateUserRequest;
import com.example.estore.dto.UserDTO;
import com.example.estore.exception.DuplicateResourceException;
import com.example.estore.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for UserService
 * Tests business logic for user management
 */
@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class UserServiceTest {

    @Autowired
    private UserService userService;

    private CreateUserRequest validUserRequest;

    @BeforeEach
    void setUp() {
        CreateAddressRequest address = new CreateAddressRequest();
        address.setZip("12345");
        address.setCountry("USA");
        address.setStreet("123 Main St");
        address.setProvince("CA");

        validUserRequest = new CreateUserRequest();
        validUserRequest.setUsername("test_user");
        validUserRequest.setEmail("test@example.com");
        validUserRequest.setRole("customer");
        validUserRequest.setAddress(address);
    }

    @Test
    void testCreateUser_Success() {
        UserDTO user = userService.createUser(validUserRequest);

        assertNotNull(user);
        assertNotNull(user.getId());
        assertEquals("test_user", user.getUsername());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("customer", user.getRole());
        assertNotNull(user.getAddress());
    }

    @Test
    void testCreateUser_DuplicateEmail() {
        userService.createUser(validUserRequest);

        validUserRequest.setUsername("different_user");
        
        assertThrows(DuplicateResourceException.class, () -> 
            userService.createUser(validUserRequest)
        );
    }

    @Test
    void testCreateUser_DuplicateUsername() {
        userService.createUser(validUserRequest);

        validUserRequest.setEmail("different@example.com");
        
        assertThrows(DuplicateResourceException.class, () -> 
            userService.createUser(validUserRequest)
        );
    }

    @Test
    void testGetUserById_Success() {
        UserDTO created = userService.createUser(validUserRequest);
        UserDTO retrieved = userService.getUserById(created.getId());

        assertNotNull(retrieved);
        assertEquals(created.getId(), retrieved.getId());
        assertEquals(created.getUsername(), retrieved.getUsername());
    }

    @Test
    void testGetUserById_NotFound() {
        assertThrows(ResourceNotFoundException.class, () -> 
            userService.getUserById(9999)
        );
    }

    @Test
    void testGetUserByEmail_Success() {
        userService.createUser(validUserRequest);
        UserDTO retrieved = userService.getUserByEmail("test@example.com");

        assertNotNull(retrieved);
        assertEquals("test@example.com", retrieved.getEmail());
    }

    @Test
    void testGetUserByEmail_NotFound() {
        assertThrows(ResourceNotFoundException.class, () -> 
            userService.getUserByEmail("nonexistent@example.com")
        );
    }

    @Test
    void testUpdateUser_Success() {
        UserDTO created = userService.createUser(validUserRequest);

        validUserRequest.setUsername("updated_user");
        validUserRequest.setEmail("updated@example.com");

        UserDTO updated = userService.updateUser(created.getId(), validUserRequest);

        assertEquals("updated_user", updated.getUsername());
        assertEquals("updated@example.com", updated.getEmail());
    }

    @Test
    void testDeleteUser_Success() {
        UserDTO created = userService.createUser(validUserRequest);
        
        userService.deleteUser(created.getId());

        assertThrows(ResourceNotFoundException.class, () -> 
            userService.getUserById(created.getId())
        );
    }

    @Test
    void testGetAllUsers_Success() {
        userService.createUser(validUserRequest);

        validUserRequest.setUsername("user2");
        validUserRequest.setEmail("user2@example.com");
        userService.createUser(validUserRequest);

        var users = userService.getAllUsers();

        assertTrue(users.size() >= 2);
    }
}
