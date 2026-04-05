package com.skyvoyage.service;

import java.util.*;
import java.util.concurrent.*;

/**
 * In-memory Cache Service with TTL
 * Uses ConcurrentHashMap for thread safety
 * 
 * Core Java: Collections, Generics, Concurrency
 */
public class CacheService<V> {
    
    private final ConcurrentHashMap<String, CacheEntry<V>> cache = new ConcurrentHashMap<>();
    private final int ttlSeconds;
    private final int maxSize;
    private final ScheduledExecutorService cleaner;
    
    private static class CacheEntry<V> {
        final V value;
        final long expireAt;
        
        CacheEntry(V value, long ttlMillis) {
            this.value = value;
            this.expireAt = System.currentTimeMillis() + ttlMillis;
        }
        
        boolean isExpired() {
            return System.currentTimeMillis() > expireAt;
        }
    }
    
    public CacheService(int ttlSeconds, int maxSize) {
        this.ttlSeconds = ttlSeconds;
        this.maxSize = maxSize;
        
        // Background cleaner thread
        this.cleaner = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "CacheCleanerThread");
            t.setDaemon(true);
            return t;
        });
        
        this.cleaner.scheduleAtFixedRate(this::evictExpired, 30, 30, TimeUnit.SECONDS);
    }
    
    public void put(String key, V value) {
        if (cache.size() >= maxSize) {
            evictExpired();
            // If still full, remove oldest entries
            if (cache.size() >= maxSize) {
                cache.entrySet().stream()
                    .sorted(Comparator.comparingLong(e -> e.getValue().expireAt))
                    .limit(maxSize / 4)
                    .forEach(e -> cache.remove(e.getKey()));
            }
        }
        cache.put(key, new CacheEntry<>(value, ttlSeconds * 1000L));
    }
    
    public Optional<V> get(String key) {
        CacheEntry<V> entry = cache.get(key);
        if (entry == null || entry.isExpired()) {
            cache.remove(key);
            return Optional.empty();
        }
        return Optional.of(entry.value);
    }
    
    public void invalidate(String key) {
        cache.remove(key);
    }
    
    public int size() {
        return cache.size();
    }
    
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("size", cache.size());
        stats.put("maxSize", maxSize);
        stats.put("ttlSeconds", ttlSeconds);
        return stats;
    }
    
    private void evictExpired() {
        cache.entrySet().removeIf(e -> e.getValue().isExpired());
    }
    
    public void shutdown() {
        cleaner.shutdownNow();
        cache.clear();
    }
}
