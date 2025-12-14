package com.example.estore.dto;

import jakarta.validation.constraints.*;

public class CreateAddressRequest {
    @NotBlank(message = "ZIP code is required")
    private String zip;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "Street is required")
    private String street;

    @NotBlank(message = "Province is required")
    private String province;

    // Getters and Setters
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
