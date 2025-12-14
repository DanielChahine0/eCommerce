package com.example.estore.dto;

public class AddressDTO {
    private Integer id;
    private String zip;
    private String country;
    private String street;
    private String province;

    public AddressDTO() {
    }

    public AddressDTO(Integer id, String zip, String country, String street, String province) {
        this.id = id;
        this.zip = zip;
        this.country = country;
        this.street = street;
        this.province = province;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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
