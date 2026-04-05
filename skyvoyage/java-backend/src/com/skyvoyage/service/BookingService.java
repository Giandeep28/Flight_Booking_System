package com.skyvoyage.service;

import com.skyvoyage.util.PNRGenerator;

import java.io.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Booking Service
 * 
 * Core Java: ReentrantLock, ConcurrentHashMap, 
 *            UUID, File Handling, Exception Handling
 */
public class BookingService {
    
    // Seat locks per flight (thread-safe)
    private final ConcurrentHashMap<String, ReentrantLock> seatLocks = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Map<String, Object>> bookingStore = new ConcurrentHashMap<>();
    private final ExecutorService executor;
    
    public BookingService(ExecutorService executor) {
        this.executor = executor;
    }
    
    /**
     * Create a new booking with PNR generation and seat locking
     */
    public CompletableFuture<Map<String, Object>> createBooking(
            Map<String, Object> flightData, 
            Map<String, Object> passengerData) {
        
        return CompletableFuture.supplyAsync(() -> {
            String flightId = String.valueOf(flightData.getOrDefault("id", "unknown"));
            
            // Acquire seat lock for this flight
            ReentrantLock lock = seatLocks.computeIfAbsent(flightId, k -> new ReentrantLock());
            
            try {
                if (!lock.tryLock(5, TimeUnit.SECONDS)) {
                    return errorResult("Flight is being booked by another user. Please try again.");
                }
                
                try {
                    // Generate PNR
                    String pnr = PNRGenerator.generate();
                    String bookingId = UUID.randomUUID().toString();
                    
                    // Build booking object
                    Map<String, Object> booking = new LinkedHashMap<>();
                    booking.put("bookingId", bookingId);
                    booking.put("pnr", pnr);
                    booking.put("flight", flightData);
                    booking.put("passenger", passengerData);
                    booking.put("status", "Confirmed");
                    booking.put("createdAt", new Date().toString());
                    
                    // Calculate pricing
                    Object priceObj = flightData.getOrDefault("price", 5000);
                    int price = priceObj instanceof Number ? ((Number) priceObj).intValue() : 5000;
                    int taxes = (int)(price * 0.18);
                    
                    Map<String, Object> pricing = new LinkedHashMap<>();
                    pricing.put("baseFare", price);
                    pricing.put("taxes", taxes);
                    pricing.put("total", price + taxes);
                    pricing.put("currency", "INR");
                    booking.put("pricing", pricing);
                    
                    booking.put("eticketNumber", "ET" + Long.toHexString(System.currentTimeMillis()).toUpperCase());
                    booking.put("loyaltyPointsEarned", price / 100);
                    
                    // Store in memory
                    bookingStore.put(pnr, booking);
                    
                    System.out.println("[BookingService] ✅ PNR " + pnr + " created for " + passengerData.get("name"));
                    
                    // Write to booking log file (File Handling)
                    logBooking(booking);
                    
                    Map<String, Object> result = new LinkedHashMap<>();
                    result.put("success", true);
                    result.put("message", "Booking confirmed!");
                    result.put("booking", booking);
                    return result;
                    
                } finally {
                    lock.unlock();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return errorResult("Booking interrupted");
            }
        }, executor);
    }
    
    /**
     * Look up booking by PNR
     */
    public Optional<Map<String, Object>> lookupByPNR(String pnr) {
        return Optional.ofNullable(bookingStore.get(pnr.toUpperCase()));
    }
    
    /**
     * Cancel booking with refund calculation
     */
    public Map<String, Object> cancelBooking(String pnr) {
        Map<String, Object> booking = bookingStore.get(pnr.toUpperCase());
        if (booking == null) {
            return errorResult("Booking not found");
        }
        
        if ("Cancelled".equals(booking.get("status"))) {
            return errorResult("Already cancelled");
        }
        
        // Calculate refund
        @SuppressWarnings("unchecked")
        Map<String, Object> pricing = (Map<String, Object>) booking.get("pricing");
        int total = pricing != null ? ((Number) pricing.getOrDefault("total", 0)).intValue() : 0;
        
        // For simplicity, give 75% refund
        int refundAmount = (int)(total * 0.75);
        
        booking.put("status", "Cancelled");
        booking.put("refundAmount", refundAmount);
        booking.put("cancelledAt", new Date().toString());
        
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("message", "Booking cancelled. Refund of ₹" + refundAmount + " will be processed.");
        result.put("refundAmount", refundAmount);
        return result;
    }
    
    /**
     * Get all bookings (for admin)
     */
    public List<Map<String, Object>> getAllBookings() {
        return new ArrayList<>(bookingStore.values());
    }
    
    /**
     * Log booking to file (File Handling + IO Streams)
     */
    private void logBooking(Map<String, Object> booking) {
        executor.submit(() -> {
            try {
                File logDir = new File("logs");
                if (!logDir.exists()) logDir.mkdirs();
                
                File logFile = new File(logDir, "bookings.log");
                try (FileWriter writer = new FileWriter(logFile, true);
                     BufferedWriter bw = new BufferedWriter(writer)) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> f = (Map<String, Object>) booking.get("flight");
                    @SuppressWarnings("unchecked")
                    Map<String, Object> p = (Map<String, Object>) booking.get("passenger");
                    @SuppressWarnings("unchecked")
                    Map<String, Object> pr = (Map<String, Object>) booking.get("pricing");
                    
                    bw.write(String.format("[%s] PNR=%s Flight=%s Passenger=%s Amount=%s%n",
                        new Date(),
                        booking.get("pnr"),
                        f.get("id"),
                        p.get("name"),
                        pr.get("total")
                    ));
                }
            } catch (IOException e) {
                System.err.println("[BookingService] Log write failed: " + e.getMessage());
            }
        });
    }
    
    private Map<String, Object> errorResult(String message) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", false);
        result.put("message", message);
        return result;
    }
    
    public int getActiveBookingCount() {
        return bookingStore.size();
    }
}
