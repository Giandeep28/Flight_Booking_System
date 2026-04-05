package com.skyvoyage.controller;

import com.skyvoyage.model.Flight;
import com.skyvoyage.service.PricingEngine;
import com.skyvoyage.service.SeatManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
public class FlightController {
    
    private final PricingEngine pricingEngine;
    private final SeatManager seatManager;
    
    public FlightController(PricingEngine pricingEngine, SeatManager seatManager) {
        this.pricingEngine = pricingEngine;
        this.seatManager = seatManager;
    }
    
    @GetMapping
    public List<Flight> getFlights(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Integer passengers) {
        
        // Mock flight data - in real implementation, this would call external APIs
        List<Flight> flights = generateMockFlights(from, to, passengers);
        
        // Apply competitive pricing
        pricingEngine.generateCompetitivePricing(flights);
        
        return flights;
    }
    
    @PostMapping("/search")
    public List<Flight> searchFlights(@RequestBody FlightSearchRequest request) {
        List<Flight> flights = generateMockFlights(
            request.getFrom(), 
            request.getTo(), 
            request.getPassengers()
        );
        
        pricingEngine.generateCompetitivePricing(flights);
        
        return flights;
    }
    
    @PostMapping("/bookings")
    public Booking createBooking(@RequestBody BookingRequest bookingRequest) {
        // Create booking
        String pnr = generatePNR();
        
        // Lock seat
        boolean seatLocked = seatManager.lockSeat(
            bookingRequest.getFlightId(), 
            bookingRequest.getSeatId(), 
            bookingRequest.getUserId(), 
            5 // 5 minutes
        );
        
        if (!seatLocked) {
            throw new RuntimeException("Seat not available");
        }
        
        return new Booking(
            pnr,
            bookingRequest.getFlightId(),
            bookingRequest.getPassengerName(),
            bookingRequest.getPassengerEmail(),
            bookingRequest.getPassengerPhone(),
            java.time.LocalDateTime.now(),
            "confirmed",
            bookingRequest.getSeatId(),
            calculateTotalPrice(bookingRequest.getFlightId(), bookingRequest.getPassengers())
        );
    }
    
    @GetMapping("/bookings/{pnr}")
    public Booking getBooking(@PathVariable String pnr) {
        // Mock booking lookup
        return new Booking(
            pnr,
            "FL1234",
            "John Doe",
            "john@example.com",
            "+1234567890",
            java.time.LocalDateTime.now(),
            "confirmed",
            "12A",
            5000.0
        );
    }
    
    // Helper methods
    private List<Flight> generateMockFlights(String from, String to, Integer passengers) {
        // Mock implementation - replace with actual API calls
        return List.of();
    }
    
    private String generatePNR() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private double calculateTotalPrice(String flightId, int passengers) {
        // Mock calculation
        return 5000.0 * passengers;
    }
}

// Request DTOs
class FlightSearchRequest {
    private String from;
    private String to;
    private String date;
    private Integer passengers;
    
    // Getters and setters
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public Integer getPassengers() { return passengers; }
    public void setPassengers(Integer passengers) { this.passengers = passengers; }
    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getSeatId() { return seatId; }
    public void setSeatId(String seatId) { this.seatId = seatId; }
}
