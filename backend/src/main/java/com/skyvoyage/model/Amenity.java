package com.skyvoyage.model;

public class Amenity {
    private String name;
    private String icon;

    // Constructors
    public Amenity() {}

    public Amenity(String name, String icon) {
        this.name = name;
        this.icon = icon;
    }

    // Getters
    public String getName() { return name; }
    public String getIcon() { return icon; }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setIcon(String icon) { this.icon = icon; }

    @Override
    public String toString() {
        return String.format("%s (%s)", name, icon);
    }
}
