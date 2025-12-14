package com.example.estore.dto;

public class UserDTO {
    private Integer id;
    private String username;
    private String role;
    private String email;
    private AddressDTO address;

    public UserDTO() {
    }

    public UserDTO(Integer id, String username, String role, String email, AddressDTO address) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.email = email;
        this.address = address;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public AddressDTO getAddress() {
        return address;
    }

    public void setAddress(AddressDTO address) {
        this.address = address;
    }
}
