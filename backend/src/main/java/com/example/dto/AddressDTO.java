package com.example.dto;

import jakarta.validation.constraints.NotBlank;

public class AddressDTO {

    private Long id;

    @NotBlank(message = "ZIP code is required")
    private String zip;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "Street is required")
    private String street;

    @NotBlank(message = "Province is required")
    private String province;

    // Constructors
    public AddressDTO() {
    }

    public AddressDTO(Long id, String zip, String country, String street, String province) {
        this.id = id;
        this.zip = zip;
        this.country = country;
        this.street = street;
        this.province = province;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }
}
