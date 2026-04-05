package com.skyvoyage.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Live Amadeus flight orders when a full {@code raw_offer} is present; otherwise simulated PNR + e-ticket
 * (Duffel and other channels until NDC order APIs are wired end-to-end).
 */
public class BookingService {

    private static final ExecutorService EXECUTOR = Executors.newFixedThreadPool(8);
    private static final ReentrantLock BOOKING_LOCK = new ReentrantLock();
    private static final ConcurrentHashMap<String, Lock> SEAT_LOCKS = new ConcurrentHashMap<>();
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    private final Path logDir;
    private final Path ticketDir;

    public BookingService() {
        String base = System.getenv("SKYVOYAGE_DATA_DIR");
        if (base == null || base.isEmpty()) {
            base = "skyvoyage-data";
        }
        try {
            this.logDir = Path.of(base, "logs");
            this.ticketDir = Path.of(base, "tickets");
            Files.createDirectories(logDir);
            Files.createDirectories(ticketDir);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static String amadeusApiBase() {
        boolean prod = "true".equalsIgnoreCase(System.getenv("AMADEUS_PRODUCTION"))
                || "production".equalsIgnoreCase(System.getenv("AMADEUS_ENV"));
        return prod ? "https://api.amadeus.com" : "https://test.api.amadeus.com";
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> createBooking(Map<String, Object> requestBody, String amadeusToken) {
        BOOKING_LOCK.lock();
        try {
            return performBooking(requestBody, amadeusToken);
        } finally {
            BOOKING_LOCK.unlock();
        }
    }

    private Map<String, Object> performBooking(Map<String, Object> requestBody, String amadeusToken) throws Exception {
        Object raw = extractRawOffer(requestBody);
        if (looksLikeAmadeusFlightOffer(raw) && amadeusToken != null && !amadeusToken.isEmpty()) {
            return createAmadeusOrder(requestBody, raw, amadeusToken);
        }
        return createSimulatedBooking(requestBody);
    }

    @SuppressWarnings("unchecked")
    private static Object extractRawOffer(Map<String, Object> body) {
        Object fo = body.get("flightOffer");
        if (fo instanceof Map<?, ?> fm) {
            Object ro = fm.get("raw_offer");
            if (ro != null) return ro;
            ro = fm.get("rawOffer");
            if (ro != null) return ro;
        }
        Object ro = body.get("raw_offer");
        if (ro != null) return ro;
        return body.get("rawOffer");
    }

    private static boolean looksLikeAmadeusFlightOffer(Object raw) {
        if (!(raw instanceof Map<?, ?> m)) return false;
        Object type = m.get("type");
        if ("flight-offer".equals(type)) return true;
        return m.containsKey("itineraries") && m.containsKey("price");
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> createAmadeusOrder(Map<String, Object> body, Object rawOffer, String token)
            throws Exception {
        JsonArray travelers = new JsonArray();
        Object passengersObj = body.get("passengers");
        if (passengersObj instanceof List<?> travelersList) {
            int id = 1;
            for (Object t : travelersList) {
                if (t instanceof Map<?, ?> tm) {
                    JsonObject traveler = new JsonObject();
                    traveler.addProperty("id", String.valueOf(id++));
                    traveler.addProperty("dateOfBirth", str(tm.get("dob"), "1990-01-01"));
                    String full = str(tm.get("name"), str(tm.get("firstName"), "Guest") + " " + str(tm.get("lastName"), "User"));
                    full = full.trim();
                    String first;
                    String last;
                    int sp = full.indexOf(' ');
                    if (sp > 0) {
                        first = full.substring(0, sp).trim();
                        last = full.substring(sp + 1).trim();
                    } else {
                        first = full.isEmpty() ? "Guest" : full;
                        last = "PAX";
                    }
                    JsonObject name = new JsonObject();
                    name.addProperty("firstName", first.length() > 20 ? first.substring(0, 20) : first);
                    name.addProperty("lastName", last.length() > 20 ? last.substring(0, 20) : last);
                    traveler.add("name", name);
                    traveler.addProperty("gender", normalizeGender(str(tm.get("gender"), "MALE")));
                    JsonObject contact = new JsonObject();
                    JsonArray phones = new JsonArray();
                    JsonObject phone = new JsonObject();
                    phone.addProperty("deviceType", "MOBILE");
                    phone.addProperty("countryCallingCode", str(tm.get("phoneCountryCode"), "91"));
                    String num = str(tm.get("phone"), "9999999999").replaceAll("[^0-9]", "");
                    if (num.length() > 15) num = num.substring(0, 15);
                    phone.addProperty("number", num.isEmpty() ? "9999999999" : num);
                    phones.add(phone);
                    contact.add("phones", phones);
                    traveler.add("contact", contact);
                    travelers.add(traveler);
                }
            }
        }

        if (travelers.isEmpty()) {
            JsonObject traveler = new JsonObject();
            traveler.addProperty("id", "1");
            traveler.addProperty("dateOfBirth", "1990-01-01");
            JsonObject name = new JsonObject();
            name.addProperty("firstName", "Guest");
            name.addProperty("lastName", "User");
            traveler.add("name", name);
            traveler.addProperty("gender", "MALE");
            JsonObject contact = new JsonObject();
            JsonArray phones = new JsonArray();
            JsonObject phone = new JsonObject();
            phone.addProperty("deviceType", "MOBILE");
            phone.addProperty("countryCallingCode", "91");
            phone.addProperty("number", "9999999999");
            phones.add(phone);
            contact.add("phones", phones);
            traveler.add("contact", contact);
            travelers.add(traveler);
        }

        JsonObject offerJson = GSON.toJsonTree(rawOffer).getAsJsonObject();
        JsonObject payload = new JsonObject();
        JsonObject data = new JsonObject();
        data.addProperty("type", "flight-order");
        JsonArray flightOffers = new JsonArray();
        flightOffers.add(offerJson);
        data.add("flightOffers", flightOffers);
        data.add("travelers", travelers);
        payload.add("data", data);

        java.net.http.HttpRequest req = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create(amadeusApiBase() + "/v1/booking/flight-orders"))
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(GSON.toJson(payload)))
                .timeout(java.time.Duration.ofSeconds(90))
                .build();

        java.net.http.HttpResponse<String> resp = java.net.http.HttpClient.newHttpClient()
                .send(req, java.net.http.HttpResponse.BodyHandlers.ofString());

        if (resp.statusCode() >= 400) {
            return Map.of(
                    "error", "Amadeus booking failed: " + resp.body(),
                    "status", resp.statusCode(),
                    "booking_mode", "amadeus_live");
        }

        JsonObject response = JsonParser.parseString(resp.body()).getAsJsonObject();
        JsonObject orderData = response.getAsJsonObject("data");
        String pnr = orderData != null && orderData.has("id")
                ? orderData.get("id").getAsString()
                : generatePnr();

        String userId = str(body.get("userId"));
        String audit = String.format("PNR=%s userId=%s mode=amadeus_live time=%s%n", pnr, userId,
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        Files.writeString(logDir.resolve("skyvoyage-audit.log"), audit, StandardOpenOption.CREATE, StandardOpenOption.APPEND);

        Path ticketPath = ticketDir.resolve(pnr + ".json");
        Files.writeString(ticketPath, resp.body(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

        double total = 0;
        Object fo = body.get("flightOffer");
        if (fo instanceof Map<?, ?> m && m.get("price") instanceof Number n) {
            total = n.doubleValue();
        } else if (body.get("totalAmount") instanceof Number n) {
            total = n.doubleValue();
        }

        return Map.of(
                "pnr", pnr,
                "status", "confirmed",
                "booking_mode", "amadeus_live",
                "ticketPath", ticketPath.toAbsolutePath().toString(),
                "totalAmount", total,
                "currency", str(body.get("currency"), "INR"),
                "amadeusResponse", GSON.fromJson(resp.body(), Map.class));
    }

    private Map<String, Object> createSimulatedBooking(Map<String, Object> body) throws Exception {
        Future<String> pnrFuture = EXECUTOR.submit(BookingService::generatePnr);
        String pnr = pnrFuture.get(30, TimeUnit.SECONDS);

        String userId = str(body.get("userId"));
        String audit = String.format("PNR=%s userId=%s mode=simulated time=%s%n", pnr, userId,
                LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        Files.writeString(logDir.resolve("skyvoyage-audit.log"), audit, StandardOpenOption.CREATE, StandardOpenOption.APPEND);

        String ticketContent = buildTicket(pnr, body);
        Path ticketPath = ticketDir.resolve(pnr + ".json");
        Files.writeString(ticketPath, ticketContent, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

        double total = 0;
        Object fo = body.get("flightOffer");
        if (fo instanceof Map<?, ?> m && m.get("price") instanceof Number n) {
            total = n.doubleValue();
        } else if (body.get("totalAmount") instanceof Number n) {
            total = n.doubleValue();
        }

        return Map.of(
                "pnr", pnr,
                "status", "confirmed",
                "booking_mode", "simulated",
                "ticketPath", ticketPath.toAbsolutePath().toString(),
                "totalAmount", total,
                "currency", str(body.get("currency"), "INR"));
    }

    private static String buildTicket(String pnr, Map<String, Object> body) {
        Map<String, Object> ticket = Map.of(
                "pnr", pnr,
                "issuedAt", LocalDateTime.now().toString(),
                "flightOffer", body.get("flightOffer"),
                "passengers", body.get("passengers"),
                "seatMap", body.get("seatMap"),
                "addons", body.get("addons"));
        return GSON.toJson(ticket);
    }

    private static String normalizeGender(String g) {
        if (g == null || g.isEmpty()) return "MALE";
        String u = g.toUpperCase();
        if (u.startsWith("F")) return "FEMALE";
        if (u.startsWith("M")) return "MALE";
        return "MALE";
    }

    private static String generatePnr() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        ThreadLocalRandom r = ThreadLocalRandom.current();
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(r.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private static String str(Object o, String def) {
        return (o == null || String.valueOf(o).isEmpty()) ? def : String.valueOf(o);
    }

    private static String str(Object o) {
        return str(o, "");
    }
}
