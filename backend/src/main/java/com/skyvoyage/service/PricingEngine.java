package com.skyvoyage.service;

import com.skyvoyage.model.Flight;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class PricingEngine {
    
    private final Random random = new Random();
    
    /**
     * Calculate dynamic pricing based on various factors
     */
    public double calculatePrice(Flight flight, String cabinClass, int passengers, String bookingClass) {
        double basePrice = flight.getPrice();
        
        // Cabin class multiplier
        double cabinMultiplier = getCabinMultiplier(cabinClass);
        
        // Booking class multiplier
        double bookingMultiplier = getBookingMultiplier(bookingClass);
        
        // Demand-based pricing (mock implementation)
        double demandMultiplier = 1.0 + (random.nextDouble() * 0.5); // 0.5 to 1.5
        
        // Time-based pricing
        double timeMultiplier = getTimeMultiplier(flight.getDepartureTime());
        
        double finalPrice = basePrice * cabinMultiplier * bookingMultiplier * demandMultiplier * timeMultiplier;
        
        return Math.round(finalPrice * passengers * 100.0) / 100.0;
    }
    
    /**
     * Get cabin class pricing multiplier
     */
    private double getCabinMultiplier(String cabinClass) {
        switch (cabinClass.toLowerCase()) {
            case "economy":
                return 1.0;
            case "premium economy":
                return 1.5;
            case "business":
                return 2.5;
            case "first class":
                return 4.0;
            default:
                return 1.0;
        }
    }
    
    /**
     * Get booking class pricing multiplier
     */
    private double getBookingMultiplier(String bookingClass) {
        switch (bookingClass.toLowerCase()) {
            case "regular":
                return 1.0;
            case "flexible":
                return 1.2;
            case "refundable":
                return 1.5;
            default:
                return 1.0;
        }
    }
    
    /**
     * Get time-based pricing multiplier
     */
    private double getTimeMultiplier(java.time.LocalDateTime departureTime) {
        int hour = departureTime.getHour();
        
        if (hour >= 6 && hour < 9) {
            return 1.2; // Morning rush
        } else if (hour >= 17 && hour < 20) {
            return 1.3; // Evening rush
        } else if (hour >= 20 || hour < 6) {
            return 0.8; // Late night/early morning
        } else {
            return 1.0; // Regular hours
        }
    }
    
    /**
     * Generate competitive pricing for multiple airlines
     */
    public void generateCompetitivePricing(List<Flight> flights) {
        for (Flight flight : flights) {
            double basePrice = 3000 + random.nextInt(5000); // Base price 3000-8000
            double demandMultiplier = 0.8 + random.nextDouble() * 0.7;
            flight.setPrice(basePrice * demandMultiplier);
        }
    }
}
