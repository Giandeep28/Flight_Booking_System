package com.skyvoyage.config;

/**
 * Application Configuration - Core Java
 * No Spring Boot, No external frameworks
 */
public class AppConfig {
    public static final int SERVER_PORT = 8080;
    public static final int THREAD_POOL_SIZE = 16;
    public static final String MONGO_URI = "mongodb://127.0.0.1:27017";
    public static final String MONGO_DB_NAME = "skyvoyage_db";
    public static final String PYTHON_LAYER_URL = "http://127.0.0.1:5000";
    
    // Cache configuration
    public static final int CACHE_TTL_SECONDS = 180; // 3 minutes
    public static final int CACHE_MAX_SIZE = 500;
    
    // Booking configuration
    public static final String PNR_PREFIX = "SV";
    public static final int SEAT_LOCK_TIMEOUT_SECONDS = 900; // 15 minutes
    
    // Refund policy (hours before flight)
    public static final int FULL_REFUND_HOURS = 72;
    public static final int PARTIAL_REFUND_HOURS = 24;
    public static final double PARTIAL_REFUND_PERCENT = 0.50;
}
