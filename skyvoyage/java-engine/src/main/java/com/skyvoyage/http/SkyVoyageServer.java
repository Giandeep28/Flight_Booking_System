package com.skyvoyage.http;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.skyvoyage.service.BookingService;
import com.skyvoyage.service.FlightPriceService;
import com.skyvoyage.service.FlightSearchService;
import io.javalin.Javalin;
import io.javalin.http.Context;

import java.lang.reflect.Type;
import java.util.Map;

/**
 * Plain Java HTTP API (no Spring): flight search + booking.
 */
public class SkyVoyageServer {

    private static final Gson GSON = new Gson();
    private static final Type MAP_TYPE = new TypeToken<Map<String, Object>>() {}.getType();

    public static void main(String[] args) {
        int port = 8085;
        String p = System.getenv("JAVA_ENGINE_PORT");
        if (p != null && !p.isEmpty()) {
            port = Integer.parseInt(p);
        }

        FlightSearchService flightSearch = new FlightSearchService();
        FlightPriceService priceService = new FlightPriceService();
        BookingService bookingService = new BookingService();

        Javalin app = Javalin.create(cfg -> cfg.showJavalinBanner = false);

        app.exception(Exception.class, (e, ctx) -> {
            e.printStackTrace();
            ctx.status(500).json(Map.of("error", e.getMessage()));
        });

        app.post("/v1/flights/search", ctx -> {
            Map<String, Object> body = readJson(ctx);
            String origin = str(body.get("origin"), str(body.get("from")));
            String dest = str(body.get("destination"), str(body.get("to")));
            String date = str(body.get("departure_date"), str(body.get("date")));
            int adults = num(body.get("passengers"), 1);
            String currency = body.get("currency") != null ? String.valueOf(body.get("currency")) : "INR";
            String cabin = str(body.get("cabin_class"), str(body.get("cabinClass"), str(body.get("travelClass"), "Economy")));

            if (origin.isEmpty() || dest.isEmpty() || date.isEmpty()) {
                ctx.status(400).json(Map.of("error", "origin, destination, departure_date required"));
                return;
            }

            Map<String, Object> result = flightSearch.search(origin, dest, date, adults, currency, cabin);
            Integer st = (Integer) result.get("status");
            if (st != null && st == 404) {
                ctx.status(404);
            }
            ctx.json(result);
        });

        app.post("/v1/flights/price", ctx -> {
            Map<String, Object> body = readJson(ctx);
            String token = null;
            try {
                token = flightSearch.getAmadeusToken();
            } catch (Exception e) {
                ctx.status(503).json(Map.of("error", "Amadeus not configured: " + e.getMessage()));
                return;
            }
            Object raw = body.get("rawOffer");
            if (raw == null) raw = body.get("raw_offer");
            Map<String, Object> out = priceService.priceOffer(raw, token);
            if (out.containsKey("status") && out.get("status") instanceof Number n && n.intValue() >= 400) {
                ctx.status(n.intValue());
            }
            ctx.json(out);
        });

        app.post("/v1/bookings", ctx -> {
            Map<String, Object> body = readJson(ctx);
            String token = null;
            try {
                token = flightSearch.getAmadeusToken();
            } catch (Exception ignored) {
                token = null;
            }
            Map<String, Object> out = bookingService.createBooking(body, token);
            Object err = out.get("error");
            Object st = out.get("status");
            if (err != null && st instanceof Number n && n.intValue() >= 400) {
                ctx.status(n.intValue());
            }
            ctx.json(out);
        });

        app.get("/health", ctx -> {
            Map<String, Object> h = new java.util.LinkedHashMap<>();
            h.put("service", "skyvoyage-java");
            h.put("ok", true);
            h.put("amadeus_configured", !java.util.Optional.ofNullable(System.getenv("AMADEUS_API_KEY")).orElse("").isEmpty());
            h.put("duffel_configured", !java.util.Optional.ofNullable(System.getenv("DUFFEL_ACCESS_TOKEN")).orElse("").isEmpty());
            h.put("aviationstack_configured", !java.util.Optional.ofNullable(System.getenv("AVIATION_STACK_KEY")).orElse("").isEmpty());
            h.put("live_flight_search", !java.util.Optional.ofNullable(System.getenv("AMADEUS_API_KEY")).orElse("").isEmpty()
                    || !java.util.Optional.ofNullable(System.getenv("DUFFEL_ACCESS_TOKEN")).orElse("").isEmpty()
                    || !java.util.Optional.ofNullable(System.getenv("AVIATION_STACK_KEY")).orElse("").isEmpty());
            ctx.json(h);
        });

        Runtime.getRuntime().addShutdownHook(new Thread(flightSearch::shutdown));

        app.start(port);
        System.out.println("SkyVoyage Java engine http://localhost:" + port);
    }

    private static Map<String, Object> readJson(Context ctx) {
        String body = ctx.body();
        if (body == null || body.isBlank()) {
            return Map.of();
        }
        return GSON.fromJson(body, MAP_TYPE);
    }

    private static String str(Object primary, String fallback) {
        if (primary != null) return String.valueOf(primary).trim();
        return fallback != null ? fallback : "";
    }

    private static int num(Object o, int def) {
        if (o == null) return def;
        if (o instanceof Number n) return n.intValue();
        try {
            return Integer.parseInt(String.valueOf(o));
        } catch (NumberFormatException e) {
            return def;
        }
    }
}
