package com.skyvoyage.server;

import com.sun.net.httpserver.*;
import com.skyvoyage.config.AppConfig;
import com.skyvoyage.service.*;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;
import java.lang.management.ManagementFactory;

/**
 * SkyVoyage Core Java Backend Server
 * 
 * Uses: Multithreading (ExecutorService, CompletableFuture),
 *       OOP, Collections, Generics, Lambdas,
 *       File Handling, IO Streams, Exception Handling
 * 
 * Port: 8080
 */
public class SkyVoyageServer {
    
    private final HttpServer server;
    private final ExecutorService threadPool;
    private final FlightSearchService flightSearchService;
    private final BookingService bookingService;
    
    public SkyVoyageServer() throws IOException {
        // Thread pool for concurrent request handling
        this.threadPool = Executors.newFixedThreadPool(AppConfig.THREAD_POOL_SIZE, r -> {
            Thread t = new Thread(r, "SkyVoyage-Worker-" + System.nanoTime());
            t.setDaemon(true);
            return t;
        });
        
        // Initialize services
        this.flightSearchService = new FlightSearchService(threadPool);
        this.bookingService = new BookingService(threadPool);
        
        // Create HTTP server
        this.server = HttpServer.create(new InetSocketAddress(AppConfig.SERVER_PORT), 0);
        this.server.setExecutor(threadPool);
        
        // Register routes
        registerRoutes();
    }
    
    private void registerRoutes() {
        server.createContext("/health", this::handleHealth);
        server.createContext("/api/flights/search", this::handleFlightSearch);
        server.createContext("/api/flights/revalidate", this::handlePriceRevalidation);
        server.createContext("/api/bookings/create", this::handleCreateBooking);
        server.createContext("/api/bookings/lookup", this::handleLookupBooking);
        server.createContext("/api/bookings/cancel", this::handleCancelBooking);
        server.createContext("/api/bookings/all", this::handleAllBookings);
        server.createContext("/api/stats", this::handleStats);
    }
    
    // ── CORS + JSON helpers ────────────────────────────────────
    private void setCorsHeaders(HttpExchange exchange) {
        Headers headers = exchange.getResponseHeaders();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        headers.set("Content-Type", "application/json; charset=UTF-8");
    }
    
    private void sendJson(HttpExchange exchange, int status, String json) throws IOException {
        setCorsHeaders(exchange);
        byte[] response = json.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(status, response.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(response);
        }
    }
    
    private String readBody(HttpExchange exchange) throws IOException {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
            return reader.lines().collect(Collectors.joining());
        }
    }
    
    // Simple JSON parser (no external libraries)
    private Map<String, Object> parseJson(String json) {
        Map<String, Object> map = new LinkedHashMap<>();
        if (json == null || json.trim().isEmpty()) return map;
        
        // Strip outer braces
        json = json.trim();
        if (json.startsWith("{")) json = json.substring(1);
        if (json.endsWith("}")) json = json.substring(0, json.length() - 1);
        
        // Simple key-value parsing
        StringBuilder current = new StringBuilder();
        String key = null;
        int depth = 0;
        boolean inString = false;
        boolean escaped = false;
        
        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);
            
            if (escaped) { current.append(c); escaped = false; continue; }
            if (c == '\\') { current.append(c); escaped = true; continue; }
            
            if (c == '"') { inString = !inString; current.append(c); continue; }
            if (inString) { current.append(c); continue; }
            
            if (c == '{' || c == '[') { depth++; current.append(c); continue; }
            if (c == '}' || c == ']') { depth--; current.append(c); continue; }
            
            if (depth > 0) { current.append(c); continue; }
            
            if (c == ':' && key == null) {
                key = current.toString().trim().replaceAll("\"", "");
                current = new StringBuilder();
                continue;
            }
            
            if (c == ',') {
                if (key != null) {
                    map.put(key, parseValue(current.toString().trim()));
                }
                key = null;
                current = new StringBuilder();
                continue;
            }
            
            current.append(c);
        }
        
        // Last pair
        if (key != null) {
            map.put(key, parseValue(current.toString().trim()));
        }
        
        return map;
    }
    
    private Object parseValue(String val) {
        if (val.startsWith("\"") && val.endsWith("\"")) return val.substring(1, val.length() - 1);
        if ("true".equals(val)) return true;
        if ("false".equals(val)) return false;
        if ("null".equals(val)) return null;
        try { return Integer.parseInt(val); } catch (NumberFormatException e) {}
        try { return Double.parseDouble(val); } catch (NumberFormatException e) {}
        if (val.startsWith("{")) return parseJson(val);
        return val;
    }
    
    private String toJson(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder("{");
        int i = 0;
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (i++ > 0) sb.append(",");
            sb.append("\"").append(entry.getKey()).append("\":");
            sb.append(valueToJson(entry.getValue()));
        }
        sb.append("}");
        return sb.toString();
    }
    
    private String valueToJson(Object val) {
        if (val == null) return "null";
        if (val instanceof String) return "\"" + ((String) val).replace("\"", "\\\"") + "\"";
        if (val instanceof Number || val instanceof Boolean) return val.toString();
        if (val instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> map = (Map<String, Object>) val;
            return toJson(map);
        }
        if (val instanceof List) {
            List<?> list = (List<?>) val;
            return "[" + list.stream().map(this::valueToJson).collect(Collectors.joining(",")) + "]";
        }
        return "\"" + val.toString() + "\"";
    }
    
    // ── Route Handlers ─────────────────────────────────────────
    
    private void handleHealth(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equals(exchange.getRequestMethod())) { sendJson(exchange, 200, "{}"); return; }
        
        Map<String, Object> health = new LinkedHashMap<>();
        health.put("status", "ok");
        health.put("service", "java-core-backend");
        health.put("port", AppConfig.SERVER_PORT);
        health.put("threads", AppConfig.THREAD_POOL_SIZE);
        health.put("activeBookings", bookingService.getActiveBookingCount());
        health.put("cacheStats", flightSearchService.getCacheStats());
        health.put("timestamp", new Date().toString());
        
        sendJson(exchange, 200, toJson(health));
    }
    
    private void handleFlightSearch(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equals(exchange.getRequestMethod())) { sendJson(exchange, 200, "{}"); return; }
        
        try {
            String body = readBody(exchange);
            Map<String, Object> req = parseJson(body);
            
            String from = String.valueOf(req.getOrDefault("from", ""));
            String to = String.valueOf(req.getOrDefault("to", ""));
            String date = String.valueOf(req.getOrDefault("date", ""));
            int passengers = req.get("passengers") instanceof Number 
                ? ((Number) req.get("passengers")).intValue() : 1;
            
            if (from.isEmpty() || to.isEmpty() || date.isEmpty()) {
                sendJson(exchange, 400, "{\"success\":false,\"message\":\"from, to, and date are required\"}");
                return;
            }
            
            System.out.println("[Java] Flight search: " + from + " → " + to + " on " + date);
            
            CompletableFuture<String> result = flightSearchService.searchFlights(
                from.toUpperCase(), to.toUpperCase(), date, passengers);
            
            String response = result.get(12, TimeUnit.SECONDS);
            sendJson(exchange, 200, response);
            
        } catch (TimeoutException e) {
            sendJson(exchange, 504, "{\"success\":false,\"message\":\"Search timed out\"}");
        } catch (Exception e) {
            System.err.println("[Java] Search error: " + e.getMessage());
            sendJson(exchange, 500, "{\"success\":false,\"message\":\"Search failed: " + e.getMessage() + "\"}");
        }
    }
    
    private void handlePriceRevalidation(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equals(exchange.getRequestMethod())) { sendJson(exchange, 200, "{}"); return; }
        
        try {
            String body = readBody(exchange);
            Map<String, Object> req = parseJson(body);
            
            String flightId = String.valueOf(req.getOrDefault("flightId", ""));
            String origin = String.valueOf(req.getOrDefault("origin", ""));
            String destination = String.valueOf(req.getOrDefault("destination", ""));
            String date = String.valueOf(req.getOrDefault("date", ""));
            
            CompletableFuture<String> result = flightSearchService.revalidatePrice(flightId, origin, destination, date);
            String response = result.get(10, TimeUnit.SECONDS);
            sendJson(exchange, 200, response);
            
        } catch (Exception e) {
            sendJson(exchange, 500, "{\"success\":false,\"message\":\"Price revalidation failed\"}");
        }
    }
    
    @SuppressWarnings("unchecked")
    private void handleCreateBooking(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equals(exchange.getRequestMethod())) { sendJson(exchange, 200, "{}"); return; }
        
        try {
            String body = readBody(exchange);
            Map<String, Object> req = parseJson(body);
            
            Map<String, Object> flight = req.get("flight") instanceof Map 
                ? (Map<String, Object>) req.get("flight") : new HashMap<>();
            Map<String, Object> passenger = req.get("passenger") instanceof Map
                ? (Map<String, Object>) req.get("passenger") : new HashMap<>();
            
            if (flight.isEmpty() || passenger.isEmpty()) {
                sendJson(exchange, 400, "{\"success\":false,\"message\":\"flight and passenger data required\"}");
                return;
            }
            
            CompletableFuture<Map<String, Object>> result = bookingService.createBooking(flight, passenger);
            Map<String, Object> booking = result.get(10, TimeUnit.SECONDS);
            
            int status = Boolean.TRUE.equals(booking.get("success")) ? 201 : 400;
            sendJson(exchange, status, toJson(booking));
            
        } catch (Exception e) {
            sendJson(exchange, 500, "{\"success\":false,\"message\":\"Booking failed: " + e.getMessage() + "\"}");
        }
    }
    
    private void handleLookupBooking(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equals(exchange.getRequestMethod())) { sendJson(exchange, 200, "{}"); return; }
        
        try {
            String body = readBody(exchange);
            Map<String, Object> req = parseJson(body);
            String pnr = String.valueOf(req.getOrDefault("pnr", ""));
            
            Optional<Map<String, Object>> booking = bookingService.lookupByPNR(pnr);
            
            if (booking.isPresent()) {
                Map<String, Object> result = new LinkedHashMap<>();
                result.put("success", true);
                result.put("booking", booking.get());
                sendJson(exchange, 200, toJson(result));
            } else {
                sendJson(exchange, 404, "{\"success\":false,\"message\":\"Booking not found\"}");
            }
        } catch (Exception e) {
            sendJson(exchange, 500, "{\"success\":false,\"message\":\"Lookup failed\"}");
        }
    }
    
    private void handleCancelBooking(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equals(exchange.getRequestMethod())) { sendJson(exchange, 200, "{}"); return; }
        
        try {
            String body = readBody(exchange);
            Map<String, Object> req = parseJson(body);
            String pnr = String.valueOf(req.getOrDefault("pnr", ""));
            
            Map<String, Object> result = bookingService.cancelBooking(pnr);
            int status = Boolean.TRUE.equals(result.get("success")) ? 200 : 400;
            sendJson(exchange, status, toJson(result));
        } catch (Exception e) {
            sendJson(exchange, 500, "{\"success\":false,\"message\":\"Cancellation failed\"}");
        }
    }
    
    private void handleAllBookings(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equals(exchange.getRequestMethod())) { sendJson(exchange, 200, "{}"); return; }
        
        List<Map<String, Object>> bookings = bookingService.getAllBookings();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("count", bookings.size());
        result.put("bookings", bookings);
        sendJson(exchange, 200, toJson(result));
    }
    
    private void handleStats(HttpExchange exchange) throws IOException {
        if ("OPTIONS".equals(exchange.getRequestMethod())) { sendJson(exchange, 200, "{}"); return; }
        
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("server", "SkyVoyage Java Core Backend");
        stats.put("port", AppConfig.SERVER_PORT);
        stats.put("threadPoolSize", AppConfig.THREAD_POOL_SIZE);
        stats.put("activeBookings", bookingService.getActiveBookingCount());
        stats.put("cache", flightSearchService.getCacheStats());
        stats.put("javaVersion", System.getProperty("java.version"));
        stats.put("uptime", ManagementFactory.getRuntimeMXBean().getUptime() + "ms");
        stats.put("timestamp", new Date().toString());
        sendJson(exchange, 200, toJson(stats));
    }
    
    public void start() {
        server.start();
        System.out.println("╔═══════════════════════════════════════════════════╗");
        System.out.println("║     SKYVOYAGE JAVA CORE BACKEND — PORT " + AppConfig.SERVER_PORT + "    ║");
        System.out.println("╠═══════════════════════════════════════════════════╣");
        System.out.println("║  Thread Pool: " + AppConfig.THREAD_POOL_SIZE + " workers                        ║");
        System.out.println("║  Cache TTL:   " + AppConfig.CACHE_TTL_SECONDS + " seconds                       ║");
        System.out.println("║  Python:      " + AppConfig.PYTHON_LAYER_URL + "          ║");
        System.out.println("╚═══════════════════════════════════════════════════╝");
        
        // Graceful shutdown hook
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("[Java] Shutting down...");
            server.stop(2);
            flightSearchService.shutdown();
            threadPool.shutdown();
        }));
    }
    
    public static void main(String[] args) {
        try {
            SkyVoyageServer server = new SkyVoyageServer();
            server.start();
            // Keep main thread alive (all worker threads are daemon)
            Thread.currentThread().join();
        } catch (IOException e) {
            System.err.println("Failed to start server: " + e.getMessage());
            e.printStackTrace();
        } catch (InterruptedException e) {
            System.out.println("[Java] Main thread interrupted, shutting down.");
        }
    }
}
