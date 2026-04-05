package com.skyvoyage.service;

import com.skyvoyage.config.AppConfig;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

/**
 * Flight Search Service
 * 
 * Core Java: ExecutorService, CompletableFuture, Generics,
 *            IO Streams, Collections, Lambdas
 */
public class FlightSearchService {
    
    private final ExecutorService executor;
    private final CacheService<String> searchCache;
    
    public FlightSearchService(ExecutorService executor) {
        this.executor = executor;
        this.searchCache = new CacheService<>(AppConfig.CACHE_TTL_SECONDS, AppConfig.CACHE_MAX_SIZE);
    }
    
    /**
     * Search flights with parallel API calls and caching
     */
    public CompletableFuture<String> searchFlights(String from, String to, String date, int passengers) {
        String cacheKey = from + "-" + to + "-" + date + "-" + passengers;
        
        // Check cache first
        Optional<String> cached = searchCache.get(cacheKey);
        if (cached.isPresent()) {
            System.out.println("[FlightSearch] Cache HIT for " + cacheKey);
            return CompletableFuture.completedFuture(cached.get());
        }
        
        System.out.println("[FlightSearch] Cache MISS for " + cacheKey + ", fetching from Python layer");
        
        // Parallel call to Python layer
        return CompletableFuture.supplyAsync(() -> {
            try {
                String jsonBody = String.format(
                    "{\"origin\":\"%s\",\"destination\":\"%s\",\"date\":\"%s\",\"passengers\":%d}",
                    from, to, date, passengers
                );
                
                String result = httpPost(AppConfig.PYTHON_LAYER_URL + "/flights/search", jsonBody);
                
                if (result != null) {
                    searchCache.put(cacheKey, result);
                }
                
                return result != null ? result : errorJson("No flights found");
            } catch (Exception e) {
                System.err.println("[FlightSearch] Error: " + e.getMessage());
                return errorJson("Flight search service unavailable: " + e.getMessage());
            }
        }, executor);
    }
    
    /**
     * Revalidate price before booking
     */
    public CompletableFuture<String> revalidatePrice(String flightId, String origin, String destination, String date) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String url = String.format(
                    "%s/flights/revalidate?flight_id=%s&origin=%s&destination=%s&date=%s",
                    AppConfig.PYTHON_LAYER_URL, 
                    URLEncoder.encode(flightId, "UTF-8"),
                    origin, destination, date
                );
                return httpPost(url, "{}");
            } catch (Exception e) {
                return errorJson("Price revalidation failed");
            }
        }, executor);
    }
    
    /**
     * HTTP POST helper using Core Java IO Streams
     */
    private String httpPost(String targetUrl, String jsonBody) throws IOException {
        URL url = URI.create(targetUrl).toURL();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);
        conn.setDoOutput(true);
        
        // Write request body
        try (OutputStream os = conn.getOutputStream()) {
            os.write(jsonBody.getBytes(StandardCharsets.UTF_8));
        }
        
        int status = conn.getResponseCode();
        
        // Read response
        InputStream is = status >= 400 ? conn.getErrorStream() : conn.getInputStream();
        if (is == null) return errorJson("Empty response");
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            return reader.lines().collect(Collectors.joining());
        }
    }
    
    public Map<String, Object> getCacheStats() {
        return searchCache.getStats();
    }
    
    private String errorJson(String message) {
        return String.format("{\"success\":false,\"message\":\"%s\",\"flights\":[]}", message);
    }
    
    public void shutdown() {
        searchCache.shutdown();
    }
}
