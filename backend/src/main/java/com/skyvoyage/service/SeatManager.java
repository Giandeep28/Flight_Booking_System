package com.skyvoyage.service;

import com.skyvoyage.model.Flight;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

@Service
public class SeatManager {
    
    private final Map<String, Map<String, Boolean>> seatLocks = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Integer>> flightSeats = new ConcurrentHashMap<>();
    private final ReentrantLock lock = new ReentrantLock();
    
    /**
     * Initialize seat availability for a flight
     */
    public void initializeFlightSeats(String flightId, int totalSeats) {
        Map<String, Integer> seats = new ConcurrentHashMap<>();
        
        // Generate seat map (mock implementation)
        for (int row = 1; row <= 20; row++) {
            for (int seat = 1; seat <= 6; seat++) {
                String seatId = String.format("%d%d", row, seat);
                seats.put(seatId, true); // Available
            }
        }
        
        flightSeats.put(flightId, seats);
    }
    
    /**
     * Check if a specific seat is available
     */
    public boolean isSeatAvailable(String flightId, String seatId) {
        Map<String, Boolean> seats = flightSeats.get(flightId);
        return seats != null && seats.getOrDefault(seatId, false);
    }
    
    /**
     * Lock a specific seat for booking
     */
    public boolean lockSeat(String flightId, String seatId, String userId, long lockDurationMinutes) {
        lock.lock();
        try {
            String lockKey = String.format("%s:%s", flightId, seatId);
            Map<String, Boolean> seatLocks = flightSeats.get(flightId);
            
            if (seatLocks != null && seatLocks.containsKey(lockKey)) {
                return false; // Already locked by another user
            }
            
            if (!isSeatAvailable(flightId, seatId)) {
                return false; // Seat not available
            }
            
            // Lock the seat
            seatLocks.put(lockKey, true);
            
            // Schedule automatic unlock
            scheduleUnlock(lockKey, lockDurationMinutes);
            
            return true;
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Unlock a specific seat
     */
    public boolean unlockSeat(String flightId, String seatId, String userId) {
        lock.lock();
        try {
            String lockKey = String.format("%s:%s", flightId, seatId);
            Map<String, Boolean> seatLocks = flightSeats.get(flightId);
            
            // Check if user owns the lock
            if (!seatLocks.containsKey(lockKey)) {
                return false;
            }
            
            // Remove the lock
            seatLocks.remove(lockKey);
            return true;
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Schedule automatic seat unlock after timeout
     */
    private void scheduleUnlock(String lockKey, long delayMinutes) {
        new Thread(() -> {
            try {
                Thread.sleep(delayMinutes * 60 * 1000); // Convert to milliseconds
                unlockSeat(lockKey.split(":")[0], lockKey.split(":")[1], "system");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }
    
    /**
     * Get available seats for a flight
     */
    public Map<String, Boolean> getAvailableSeats(String flightId) {
        Map<String, Boolean> seats = flightSeats.get(flightId);
        if (seats == null) {
            initializeFlightSeats(flightId, 120); // Default 120 seats
            seats = flightSeats.get(flightId);
        }
        return seats;
    }
    
    /**
     * Get seat locking status
     */
    public Map<String, Boolean> getSeatLocks(String flightId) {
        return seatLocks.getOrDefault(flightId, new ConcurrentHashMap<>());
    }
}
