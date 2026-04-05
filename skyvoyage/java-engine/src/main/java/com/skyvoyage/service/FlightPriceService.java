package com.skyvoyage.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Real-time flight pricing via Amadeus Flight Offers Price API.
 */
public class FlightPriceService {
    private static final HttpClient HTTP = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();
    private static final Gson GSON = new Gson();
    private final ConcurrentHashMap<String, Double> priceCache = new ConcurrentHashMap<>();
    private final ScheduledExecutorService priceUpdateExecutor = Executors.newScheduledThreadPool(2);

    private final String amadeusKey;
    private final String amadeusSecret;

    public FlightPriceService() {
        this.amadeusKey = System.getenv("AMADEUS_API_KEY");
        this.amadeusSecret = System.getenv("AMADEUS_API_SECRET");
        
        // Schedule price cache cleanup every hour
        priceUpdateExecutor.scheduleAtFixedRate(this::cleanupPriceCache, 1, 1, TimeUnit.HOURS);
    }

    private static String amadeusApiBase() {
        boolean prod = "true".equalsIgnoreCase(System.getenv("AMADEUS_PRODUCTION"))
                || "production".equalsIgnoreCase(System.getenv("AMADEUS_ENV"));
        return prod ? "https://api.amadeus.com" : "https://test.api.amadeus.com";
    }

    public Map<String, Object> priceOffer(Object rawOffer, String amadeusToken) throws Exception {
        if (amadeusToken == null || amadeusToken.isEmpty()) {
            return Map.of("error", "Amadeus token required for pricing", "status", 503);
        }
        if (rawOffer == null) {
            return Map.of("error", "No flight offer data provided for pricing", "status", 400);
        }

        JsonObject flightOffer;
        if (rawOffer instanceof String s) {
            flightOffer = JsonParser.parseString(s).getAsJsonObject();
        } else {
            flightOffer = GSON.toJsonTree(rawOffer).getAsJsonObject();
        }

        JsonObject payload = new JsonObject();
        JsonObject data = new JsonObject();
        data.addProperty("type", "flight-offers-pricing");
        JsonArray flightOffers = new JsonArray();
        flightOffers.add(flightOffer);
        data.add("flightOffers", flightOffers);
        payload.add("data", data);

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(amadeusApiBase() + "/v1/shopping/flight-offers/pricing"))
                .header("Authorization", "Bearer " + amadeusToken)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(GSON.toJson(payload)))
                .timeout(Duration.ofSeconds(60))
                .build();

        HttpResponse<String> resp = HTTP.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() >= 400) {
            return Map.of("error", "Amadeus Pricing Error: " + resp.body(), "status", resp.statusCode());
        }

        return GSON.fromJson(resp.body(), Map.class);
    }

    private void cleanupPriceCache() {
        // Remove old price entries (older than 1 hour)
        long currentTime = System.currentTimeMillis();
        priceCache.entrySet().removeIf(entry -> {
            // Simple cleanup based on cache size - in production, use timestamps
            return priceCache.size() > 1000;
        });
    }

    public void shutdown() {
        priceUpdateExecutor.shutdown();
        try {
            if (!priceUpdateExecutor.awaitTermination(30, TimeUnit.SECONDS)) {
                priceUpdateExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            priceUpdateExecutor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}
