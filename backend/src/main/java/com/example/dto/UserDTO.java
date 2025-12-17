package com.example.dto;

public class UserDTO {
    
    private Long id;
    private String username;
    private String email;
    private RoleDTO role;
    private String phoneNumber;
    private AddressDTO address;
    
    // Constructors
    public UserDTO() {}
    
    public UserDTO(Long id, String username, String email, RoleDTO role, String phoneNumber, AddressDTO address) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public RoleDTO getRole() {
        return role;
    }
    
    public void setRole(RoleDTO role) {
        this.role = role;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public AddressDTO getAddress() {
        return address;
    }
    
    public void setAddress(AddressDTO address) {
        this.address = address;
    }
}
