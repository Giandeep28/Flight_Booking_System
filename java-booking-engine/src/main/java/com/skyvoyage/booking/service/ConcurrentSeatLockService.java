package com.skyvoyage.booking.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;

/**
 * Concurrent Seat Lock Service
 * 
 * This service provides thread-safe seat locking mechanisms for concurrent booking operations.
 * Uses a combination of in-memory locking and MongoDB persistence for high performance
 * and data consistency across multiple instances.
 * 
 * Key Features:
 * - Thread-safe seat locking with ReentrantLock
 * - Automatic lock expiration (15 minutes)
 * - Deadlock prevention
 * - Distributed locking support via MongoDB
 * - Performance monitoring and metrics
 * 
 * @author SkyVoyage Team
 * @version 1.0.0
 */
@Service
public class ConcurrentSeatLockService {

    private static final Logger logger = LoggerFactory.getLogger(ConcurrentSeatLockService.class);
    
    // In-memory seat locks for fast access
    private final ConcurrentMap<String, SeatLock> seatLocks = new ConcurrentHashMap<>();
    
    // Flight-level locks to prevent deadlocks
    private final ConcurrentMap<String, ReentrantLock> flightLocks = new ConcurrentHashMap<>();
    
    // Lock timeout in minutes
    private static final int LOCK_TIMEOUT_MINUTES = 15;
    
    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * Data class representing a seat lock
     */
    public static class SeatLock {
        private final String seatId;
        private final String flightId;
        private final String userId;
        private final LocalDateTime lockTime;
        private final LocalDateTime expiryTime;
        private final String lockId;
        
        public SeatLock(String seatId, String flightId, String userId, String lockId) {
            this.seatId = seatId;
            this.flightId = flightId;
            this.userId = userId;
            this.lockId = lockId;
            this.lockTime = LocalDateTime.now();
            this.expiryTime = lockTime.plusMinutes(LOCK_TIMEOUT_MINUTES);
        }
        
        // Getters
        public String getSeatId() { return seatId; }
        public String getFlightId() { return flightId; }
        public String getUserId() { return userId; }
        public LocalDateTime getLockTime() { return lockTime; }
        public LocalDateTime getExpiryTime() { return expiryTime; }
        public String getLockId() { return lockId; }
        
        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiryTime);
        }
        
        public Map<String, Object> toMap() {
            Map<String, Object> map = new HashMap<>();
            map.put("seatId", seatId);
            map.put("flightId", flightId);
            map.put("userId", userId);
            map.put("lockTime", lockTime);
            map.put("expiryTime", expiryTime);
            map.put("lockId", lockId);
            return map;
        }
    }

    /**
     * Lock multiple seats atomically
     * 
     * @param flightId Flight identifier
     * @param seatIds List of seat identifiers to lock
     * @param userId User requesting the lock
     * @return LockResult with lock status and lock IDs
     */
    @Async
    public LockResult lockMultipleSeats(String flightId, List<String> seatIds, String userId) {
        logger.info("Attempting to lock {} seats for flight {} by user {}", seatIds.size(), flightId, userId);
        
        // Get flight-level lock to prevent deadlocks
        ReentrantLock flightLock = flightLocks.computeIfAbsent(flightId, k -> new ReentrantLock());
        
        try {
            // Acquire flight lock with timeout
            boolean acquired = flightLock.tryLock(30, TimeUnit.SECONDS);
            if (!acquired) {
                logger.warn("Failed to acquire flight lock for flight {}", flightId);
                return new LockResult(false, "Failed to acquire flight lock", Collections.emptyList());
            }
            
            try {
                // Check if any seats are already locked
                List<String> alreadyLockedSeats = seatIds.stream()
                    .filter(seatId -> isSeatLocked(seatId, flightId))
                    .collect(Collectors.toList());
                
                if (!alreadyLockedSeats.isEmpty()) {
                    logger.warn("Seats {} are already locked for flight {}", alreadyLockedSeats, flightId);
                    return new LockResult(false, "Some seats are already locked", alreadyLockedSeats);
                }
                
                // Lock all seats
                List<String> lockIds = new ArrayList<>();
                for (String seatId : seatIds) {
                    String lockId = UUID.randomUUID().toString();
                    SeatLock seatLock = new SeatLock(seatId, flightId, userId, lockId);
                    
                    // Store in memory
                    seatLocks.put(generateSeatKey(flightId, seatId), seatLock);
                    
                    // Persist to MongoDB for distributed locking
                    persistSeatLock(seatLock);
                    
                    lockIds.add(lockId);
                }
                
                logger.info("Successfully locked {} seats for flight {} by user {}", seatIds.size(), flightId, userId);
                return new LockResult(true, "Seats locked successfully", lockIds);
                
            } finally {
                flightLock.unlock();
            }
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("Thread interrupted while locking seats for flight {}", flightId, e);
            return new LockResult(false, "Operation interrupted", Collections.emptyList());
        } catch (Exception e) {
            logger.error("Error locking seats for flight {}", flightId, e);
            return new LockResult(false, "Internal error occurred", Collections.emptyList());
        }
    }

    /**
     * Release seat locks
     * 
     * @param lockIds List of lock IDs to release
     * @param userId User requesting the release (must match lock owner)
     * @return ReleaseResult with release status
     */
    @Async
    public ReleaseResult releaseSeatLocks(List<String> lockIds, String userId) {
        logger.info("Attempting to release {} locks by user {}", lockIds.size(), userId);
        
        List<String> releasedLocks = new ArrayList<>();
        List<String> failedReleases = new ArrayList<>();
        
        for (String lockId : lockIds) {
            try {
                // Find and remove from memory
                SeatLock removedLock = null;
                for (Map.Entry<String, SeatLock> entry : seatLocks.entrySet()) {
                    if (entry.getValue().getLockId().equals(lockId)) {
                        removedLock = seatLocks.remove(entry.getKey());
                        break;
                    }
                }
                
                if (removedLock == null) {
                    logger.warn("Lock {} not found in memory", lockId);
                    failedReleases.add(lockId);
                    continue;
                }
                
                // Verify ownership
                if (!removedLock.getUserId().equals(userId)) {
                    logger.warn("User {} attempted to release lock owned by user {}", userId, removedLock.getUserId());
                    failedReleases.add(lockId);
                    continue;
                }
                
                // Remove from MongoDB
                removeSeatLockFromDB(lockId);
                
                releasedLocks.add(lockId);
                logger.debug("Released lock {} for seat {}", lockId, removedLock.getSeatId());
                
            } catch (Exception e) {
                logger.error("Error releasing lock {}", lockId, e);
                failedReleases.add(lockId);
            }
        }
        
        boolean allReleased = failedReleases.isEmpty();
        String message = allReleased ? 
            "All locks released successfully" : 
            String.format("Released %d locks, %d failed", releasedLocks.size(), failedReleases.size());
        
        logger.info("Lock release result: {} - {}", allReleased, message);
        return new ReleaseResult(allReleased, message, releasedLocks, failedReleases);
    }

    /**
     * Check if a seat is locked
     * 
     * @param seatId Seat identifier
     * @param flightId Flight identifier
     * @return true if seat is locked and not expired
     */
    public boolean isSeatLocked(String seatId, String flightId) {
        String seatKey = generateSeatKey(flightId, seatId);
        SeatLock lock = seatLocks.get(seatKey);
        
        if (lock == null) {
            // Check in database
            lock = getSeatLockFromDB(seatKey);
            if (lock != null && !lock.isExpired()) {
                seatLocks.put(seatKey, lock); // Cache in memory
                return true;
            }
            return false;
        }
        
        // Remove expired locks
        if (lock.isExpired()) {
            seatLocks.remove(seatKey);
            removeSeatLockFromDB(seatKey);
            return false;
        }
        
        return true;
    }

    /**
     * Get lock information for a seat
     */
    public Optional<SeatLock> getSeatLockInfo(String seatId, String flightId) {
        String seatKey = generateSeatKey(flightId, seatId);
        SeatLock lock = seatLocks.get(seatKey);
        
        if (lock == null) {
            lock = getSeatLockFromDB(seatKey);
            if (lock != null && !lock.isExpired()) {
                seatLocks.put(seatKey, lock);
            }
        }
        
        return Optional.ofNullable(lock).filter(l -> !l.isExpired());
    }

    /**
     * Scheduled task to clean up expired locks
     * Runs every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void cleanupExpiredLocks() {
        logger.debug("Starting cleanup of expired locks");
        
        int cleanedCount = 0;
        List<String> expiredKeys = new ArrayList<>();
        
        // Check in-memory locks
        for (Map.Entry<String, SeatLock> entry : seatLocks.entrySet()) {
            if (entry.getValue().isExpired()) {
                expiredKeys.add(entry.getKey());
            }
        }
        
        // Remove expired locks
        for (String key : expiredKeys) {
            SeatLock removedLock = seatLocks.remove(key);
            if (removedLock != null) {
                removeSeatLockFromDB(removedLock.getLockId());
                cleanedCount++;
            }
        }
        
        // Also cleanup database directly for any orphaned locks
        cleanupExpiredLocksInDB();
        
        if (cleanedCount > 0) {
            logger.info("Cleaned up {} expired locks", cleanedCount);
        }
    }

    /**
     * Get lock statistics
     */
    public Map<String, Object> getLockStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLocks", seatLocks.size());
        stats.put("flightLocks", flightLocks.size());
        
        int expiredCount = (int) seatLocks.values().stream()
            .filter(SeatLock::isExpired)
            .count();
        
        stats.put("expiredLocks", expiredCount);
        stats.put("activeLocks", seatLocks.size() - expiredCount);
        
        // Locks by flight
        Map<String, Long> locksByFlight = seatLocks.values().stream()
            .collect(Collectors.groupingBy(SeatLock::getFlightId, Collectors.counting()));
        stats.put("locksByFlight", locksByFlight);
        
        return stats;
    }

    // Private helper methods
    
    private String generateSeatKey(String flightId, String seatId) {
        return flightId + ":" + seatId;
    }

    private void persistSeatLock(SeatLock seatLock) {
        try {
            Map<String, Object> lockDoc = seatLock.toMap();
            lockDoc.put("_id", seatLock.getLockId());
            mongoTemplate.save(lockDoc, "seat_locks");
        } catch (Exception e) {
            logger.error("Error persisting seat lock to database", e);
        }
    }

    private SeatLock getSeatLockFromDB(String seatKey) {
        try {
            Query query = new Query(Criteria.where("seatKey").is(seatKey));
            Map<String, Object> doc = mongoTemplate.findOne(query, Map.class, "seat_locks");
            
            if (doc != null) {
                return new SeatLock(
                    (String) doc.get("seatId"),
                    (String) doc.get("flightId"),
                    (String) doc.get("userId"),
                    (String) doc.get("lockId")
                );
            }
        } catch (Exception e) {
            logger.error("Error retrieving seat lock from database", e);
        }
        return null;
    }

    private void removeSeatLockFromDB(String lockId) {
        try {
            Query query = new Query(Criteria.where("_id").is(lockId));
            mongoTemplate.remove(query, "seat_locks");
        } catch (Exception e) {
            logger.error("Error removing seat lock from database", e);
        }
    }

    private void cleanupExpiredLocksInDB() {
        try {
            Query query = new Query(Criteria.where("expiryTime").lt(LocalDateTime.now()));
            mongoTemplate.remove(query, "seat_locks");
        } catch (Exception e) {
            logger.error("Error cleaning up expired locks in database", e);
        }
    }

    // Result classes
    
    public static class LockResult {
        private final boolean success;
        private final String message;
        private final List<String> lockIds;
        private final List<String> failedSeats;
        
        public LockResult(boolean success, String message, List<String> lockIds) {
            this.success = success;
            this.message = message;
            this.lockIds = lockIds;
            this.failedSeats = Collections.emptyList();
        }
        
        public LockResult(boolean success, String message, List<String> lockIds, List<String> failedSeats) {
            this.success = success;
            this.message = message;
            this.lockIds = lockIds;
            this.failedSeats = failedSeats;
        }
        
        // Getters
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public List<String> getLockIds() { return lockIds; }
        public List<String> getFailedSeats() { return failedSeats; }
    }

    public static class ReleaseResult {
        private final boolean success;
        private final String message;
        private final List<String> releasedLocks;
        private final List<String> failedReleases;
        
        public ReleaseResult(boolean success, String message, List<String> releasedLocks, List<String> failedReleases) {
            this.success = success;
            this.message = message;
            this.releasedLocks = releasedLocks;
            this.failedReleases = failedReleases;
        }
        
        // Getters
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public List<String> getReleasedLocks() { return releasedLocks; }
        public List<String> getFailedReleases() { return failedReleases; }
    }
}
