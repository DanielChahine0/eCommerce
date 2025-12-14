package com.example.estore.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;

    @NotNull(message = "Address is required")
    private CreateAddressRequest address;

    // Constructors
    public RegisterRequest() {
    }

    public RegisterRequest(String username, String email, String password, String role, CreateAddressRequest address) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.address = address;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public CreateAddressRequest getAddress() {
        return address;
    }

    public void setAddress(CreateAddressRequest address) {
        this.address = address;
    }
}
