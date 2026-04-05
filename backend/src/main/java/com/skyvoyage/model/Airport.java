package com.skyvoyage.model;

public class Airport {
    private String code;
    private String name;
    private String city;
    private String country;
    private String type; // "domestic" or "international"

    // Constructors
    public Airport() {}

    public Airport(String code, String name, String city, String country, String type) {
        this.code = code;
        this.name = name;
        this.city = city;
        this.country = country;
        this.type = type;
    }

    // Getters
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getCity() { return city; }
    public String getCountry() { return country; }
    public String getType() { return type; }

    // Setters
    public void setCode(String code) { this.code = code; }
    public void setName(String name) { this.name = name; }
    public void setCity(String city) { this.city = city; }
    public void setCountry(String country) { this.country = country; }
    public void setType(String type) { this.type = type; }

    @Override
    public String toString() {
        return String.format("%s - %s, %s (%s)", code, name, city, country);
    }
}
