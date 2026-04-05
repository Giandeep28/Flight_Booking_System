package com.skyvoyage.dto;

import javax.validation.constraints.*;

public class FlightSearchRequest {
    
    @NotBlank(message = "Departure city is required")
    private String from;
    
    @NotBlank(message = "Destination city is required")
    private String to;
    
    @NotBlank(message = "Travel date is required")
    private String date;
    
    @Min(value = 1, message = "At least one passenger is required")
    private Integer passengers;
    
    // Optional filters
    private Double maxPrice;
    private Integer stops;
    private String[] airlines;
    private String departureTime;
    
    // Getters and setters
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public Integer getPassengers() { return passengers; }
    public void setPassengers(Integer passengers) { this.passengers = passengers; }
    public Double getMaxPrice() { return maxPrice; }
    public void setMaxPrice(Double maxPrice) { this.maxPrice = maxPrice; }
    public Integer getStops() { return stops; }
    public void setStops(Integer stops) { this.stops = stops; }
    public String[] getAirlines() { return airlines; }
    public void setAirlines(String[] airlines) { this.airlines = airlines; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
}
