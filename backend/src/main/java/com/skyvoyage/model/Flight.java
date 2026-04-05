package com.skyvoyage.model;

import java.time.LocalDateTime;
import java.util.List;

public class Flight {
    private String id;
    private String airlineName;
    private String airlineCode;
    private String airlineLogo;
    private String flightNumber;
    private String departureAirport;
    private String arrivalAirport;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private String duration;
    private int stops;
    private List<String> layovers;
    private double price;
    private String currency;
    private String cabinClass;
    private String baggageInfo;
    private List<String> amenities;
    private String status;
    private String aircraft;

    // Constructors
    public Flight() {}

    public Flight(String id, String airlineName, String airlineCode, String airlineLogo,
                 String flightNumber, String departureAirport, String arrivalAirport,
                 LocalDateTime departureTime, LocalDateTime arrivalTime, String duration,
                 int stops, List<String> layovers, double price, String currency,
                 String cabinClass, String baggageInfo, List<String> amenities,
                 String status, String aircraft) {
        this.id = id;
        this.airlineName = airlineName;
        this.airlineCode = airlineCode;
        this.airlineLogo = airlineLogo;
        this.flightNumber = flightNumber;
        this.departureAirport = departureAirport;
        this.arrivalAirport = arrivalAirport;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.duration = duration;
        this.stops = stops;
        this.layovers = layovers;
        this.price = price;
        this.currency = currency;
        this.cabinClass = cabinClass;
        this.baggageInfo = baggageInfo;
        this.amenities = amenities;
        this.status = status;
        this.aircraft = aircraft;
    }

    // Getters
    public String getId() { return id; }
    public String getAirlineName() { return airlineName; }
    public String getAirlineCode() { return airlineCode; }
    public String getAirlineLogo() { return airlineLogo; }
    public String getFlightNumber() { return flightNumber; }
    public String getDepartureAirport() { return departureAirport; }
    public String getArrivalAirport() { return arrivalAirport; }
    public LocalDateTime getDepartureTime() { return departureTime; }
    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public String getDuration() { return duration; }
    public int getStops() { return stops; }
    public List<String> getLayovers() { return layovers; }
    public double getPrice() { return price; }
    public String getCurrency() { return currency; }
    public String getCabinClass() { return cabinClass; }
    public String getBaggageInfo() { return baggageInfo; }
    public List<String> getAmenities() { return amenities; }
    public String getStatus() { return status; }
    public String getAircraft() { return aircraft; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setAirlineName(String airlineName) { this.airlineName = airlineName; }
    public void setAirlineCode(String airlineCode) { this.airlineCode = airlineCode; }
    public void setAirlineLogo(String airlineLogo) { this.airlineLogo = airlineLogo; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }
    public void setDepartureAirport(String departureAirport) { this.departureAirport = departureAirport; }
    public void setArrivalAirport(String arrivalAirport) { this.arrivalAirport = arrivalAirport; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public void setDuration(String duration) { this.duration = duration; }
    public void setStops(int stops) { this.stops = stops; }
    public void setLayovers(List<String> layovers) { this.layovers = layovers; }
    public void setPrice(double price) { this.price = price; }
    public void setCurrency(String currency) { this.currency = currency; }
    public void setCabinClass(String cabinClass) { this.cabinClass = cabinClass; }
    public void setBaggageInfo(String baggageInfo) { this.baggageInfo = baggageInfo; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    public void setStatus(String status) { this.status = status; }
    public void setAircraft(String aircraft) { this.aircraft = aircraft; }

    @Override
    public String toString() {
        return String.format("Flight{id=%s, airline=%s, flight=%s, %s->%s, %s->%s, price=%.2f %s}",
                id, airlineName, flightNumber, departureAirport, arrivalAirport,
                price, currency, status);
    }
}
