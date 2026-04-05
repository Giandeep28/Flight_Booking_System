package com.skyvoyage.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.skyvoyage.model.Flight;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * Parallel live search: Amadeus (GDS-style offers), Duffel (modern NDC/aggregator offers),
 * AviationStack (schedules). No mock data.
 */
public class FlightSearchService {
    private static final HttpClient HTTP = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    private static final Gson GSON = new Gson();

    private final ExecutorService executor = Executors.newFixedThreadPool(12);
    private final ConcurrentHashMap<String, List<Flight>> searchCache = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> cacheTimestamps = new ConcurrentHashMap<>();
    private static final long CACHE_TTL_MS = 300000; // 5 minutes

    private volatile String amadeusToken;
    private volatile long amadeusTokenExpiryMs;

    private final String amadeusKey;
    private final String amadeusSecret;
    private final String aviationStackKey;
    private final String duffelToken;
    private final String duffelBase;
    private final String amadeusBase;

    public FlightSearchService() {
        this.amadeusKey = env("AMADEUS_API_KEY", "");
        this.amadeusSecret = env("AMADEUS_API_SECRET", "");
        this.aviationStackKey = env("AVIATION_STACK_KEY", "");
        this.duffelToken = env("DUFFEL_ACCESS_TOKEN", "");
        this.duffelBase = trimTrailingSlash(env("DUFFEL_API_BASE", "https://api.duffel.com"));
        boolean amadeusProd = "true".equalsIgnoreCase(env("AMADEUS_PRODUCTION", ""))
                || "production".equalsIgnoreCase(env("AMADEUS_ENV", "test"));
        this.amadeusBase = amadeusProd ? "https://api.amadeus.com" : "https://test.api.amadeus.com";
    }

    private static String trimTrailingSlash(String s) {
        if (s == null || s.isBlank()) return "https://api.duffel.com";
        return s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
    }

    private static String env(String k, String d) {
        String v = System.getenv(k);
        return v != null ? v : d;
    }

    public Map<String, Object> search(String origin, String destination, String departureDate,
                                      int adults, String currency, String cabinClass) throws Exception {
        String cur = (currency == null || currency.isEmpty()) ? "INR" : currency;
        String cabin = cabinClass != null ? cabinClass : "Economy";

        // Check cache first
        String cacheKey = generateCacheKey(origin, destination, departureDate, adults, cur, cabin);
        List<Flight> cachedResults = getCachedResults(cacheKey);
        if (cachedResults != null) {
            return buildResultFromCache(cachedResults);
        }

        // Enhanced parallel search with timeout handling
        CompletableFuture<List<Flight>> amadeusF = CompletableFuture.supplyAsync(() -> {
            try {
                return fetchAmadeus(origin, destination, departureDate, adults, cur, cabin);
            } catch (Exception e) {
                System.err.println("[Amadeus] " + e.getMessage());
                return Collections.emptyList();
            }
        }, executor);

        CompletableFuture<List<Flight>> duffelF = CompletableFuture.supplyAsync(() -> {
            try {
                return fetchDuffel(origin, destination, departureDate, adults, cur, cabin);
            } catch (Exception e) {
                System.err.println("[Duffel] " + e.getMessage());
                return Collections.emptyList();
            }
        }, executor);

        CompletableFuture<List<Flight>> avF = CompletableFuture.supplyAsync(() -> {
            try {
                return fetchAviationStack(origin, destination, departureDate);
            } catch (Exception e) {
                System.err.println("[AviationStack] " + e.getMessage());
                return Collections.emptyList();
            }
        }, executor);

        // Wait for all with enhanced timeout
        List<Flight> merged = new ArrayList<>();
        try {
            merged.addAll(amadeusF.get(120, TimeUnit.SECONDS));
            merged.addAll(duffelF.get(120, TimeUnit.SECONDS));
            merged.addAll(avF.get(120, TimeUnit.SECONDS));
        } catch (TimeoutException e) {
            System.err.println("[Search timeout] Some APIs timed out, using partial results");
            // Add any completed results
            if (amadeusF.isDone()) {
                try { merged.addAll(amadeusF.get()); } catch (Exception ignored) {}
            }
            if (duffelF.isDone()) {
                try { merged.addAll(duffelF.get()); } catch (Exception ignored) {}
            }
            if (avF.isDone()) {
                try { merged.addAll(avF.get()); } catch (Exception ignored) {}
            }
        }

        List<String> liveSources = new ArrayList<>();
        boolean hasAmadeus = merged.stream().anyMatch(f -> "amadeus".equals(f.rawSource));
        boolean hasDuffel = merged.stream().anyMatch(f -> "duffel".equals(f.rawSource));
        boolean hasAviation = merged.stream().anyMatch(f -> "aviationstack".equals(f.rawSource));
        if (hasAmadeus) liveSources.add("amadeus_flight_offers");
        if (hasDuffel) liveSources.add("duffel_live_offers");
        if (hasAviation) liveSources.add("aviationstack_schedules");

        if (!amadeusKey.isEmpty() && !amadeusSecret.isEmpty() && !merged.isEmpty()) {
            try {
                String token = getAmadeusToken();
                enrichAirlineNamesFromAmadeus(token, merged);
            } catch (Exception e) {
                System.err.println("[Airline names] " + e.getMessage());
            }
        }

        // Enhanced deduplication and ranking
        Map<String, Flight> byId = new LinkedHashMap<>();
        for (Flight f : merged) {
            // Apply intelligent ranking score
            f.rankingScore = calculateRankingScore(f, price);
            byId.putIfAbsent(f.id, f);
        }

        // Sort by ranking score
        List<Flight> sortedFlights = byId.values().stream()
                .sorted((f1, f2) -> Double.compare(f1.rankingScore, f2.rankingScore))
                .collect(Collectors.toList());

        // Cache results
        cacheResults(cacheKey, sortedFlights);

        List<Map<String, Object>> out = new ArrayList<>();
        for (Flight f : sortedFlights) {
            out.add(flightToMap(f));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("flights", out);
        result.put("live_sources", liveSources);
        result.put("dataset", "live_aviation_apis");
        if (!out.isEmpty()) {
            boolean bookable = hasAmadeus || hasDuffel;
            result.put("pricing_source", bookable ? "live_offer_apis" : "schedule_only");
        }
        if (out.isEmpty()) {
            result.put("error", "No flights found. Configure AMADEUS_API_KEY+SECRET, DUFFEL_ACCESS_TOKEN (https://duffel.com), and/or AVIATION_STACK_KEY.");
            result.put("status", 404);
        }
        return result;
    }

    private static String mapAmadeusTravelClass(String cabinClass) {
        if (cabinClass == null) return "ECONOMY";
        String u = cabinClass.toLowerCase();
        if (u.contains("first")) return "FIRST";
        if (u.contains("business")) return "BUSINESS";
        return "ECONOMY";
    }

    private static String mapDuffelCabin(String cabinClass) {
        if (cabinClass == null) return "economy";
        String u = cabinClass.toLowerCase();
        if (u.contains("first")) return "first";
        if (u.contains("business")) return "business";
        if (u.contains("premium")) return "premium_economy";
        return "economy";
    }

    private List<Flight> fetchAmadeus(String origin, String destination, String date, int adults, String currency, String cabinClass) throws Exception {
        if (amadeusKey.isEmpty() || amadeusSecret.isEmpty()) return Collections.emptyList();
        String token = getAmadeusToken();
        String url = amadeusBase + "/v2/shopping/flight-offers?"
                + "originLocationCode=" + urlEnc(origin)
                + "&destinationLocationCode=" + urlEnc(destination)
                + "&departureDate=" + urlEnc(date)
                + "&adults=" + adults
                + "&currencyCode=" + urlEnc(currency)
                + "&travelClass=" + urlEnc(mapAmadeusTravelClass(cabinClass))
                + "&max=15";
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + token)
                .GET()
                .timeout(Duration.ofSeconds(60))
                .build();
        HttpResponse<String> resp = HTTP.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() >= 400) {
            throw new RuntimeException("Amadeus HTTP " + resp.statusCode() + ": " + resp.body());
        }
        JsonObject root = JsonParser.parseString(resp.body()).getAsJsonObject();
        JsonArray data = root.getAsJsonArray("data");
        List<Flight> list = new ArrayList<>();
        if (data == null) return list;
        for (JsonElement el : data) {
            JsonObject offer = el.getAsJsonObject();
            String id = offer.has("id") ? offer.get("id").getAsString() : UUID.randomUUID().toString();
            JsonObject priceObj = offer.getAsJsonObject("price");
            double price = priceObj != null && priceObj.has("grandTotal") ? priceObj.get("grandTotal").getAsDouble() : 0;
            String cur = priceObj != null && priceObj.has("currency") ? priceObj.get("currency").getAsString() : currency;

            JsonArray itineraries = offer.getAsJsonArray("itineraries");
            if (itineraries == null || itineraries.isEmpty()) continue;
            JsonObject firstIt = itineraries.get(0).getAsJsonObject();
            JsonArray segments = firstIt.getAsJsonArray("segments");
            if (segments == null || segments.isEmpty()) continue;

            int stops = Math.max(0, segments.size() - 1);
            JsonObject seg0 = segments.get(0).getAsJsonObject();
            JsonObject lastSeg = segments.get(segments.size() - 1).getAsJsonObject();

            String carrier = seg0.has("carrierCode") ? seg0.get("carrierCode").getAsString() : "XX";
            String num = seg0.has("number") ? seg0.get("number").getAsString() : "";
            String fn = carrier + num;

            String depAt = seg0.getAsJsonObject("departure").get("at").getAsString();
            String arrAt = lastSeg.getAsJsonObject("arrival").get("at").getAsString();
            String depIata = seg0.getAsJsonObject("departure").get("iataCode").getAsString();
            String arrIata = lastSeg.getAsJsonObject("arrival").get("iataCode").getAsString();

            String durStr = firstIt.has("duration") ? firstIt.get("duration").getAsString() : "PT0H0M";
            int durMin = parseIsoDuration(durStr);
            if (durMin <= 0) durMin = estimateMinutes(depAt, arrAt);

            Flight f = new Flight();
            f.id = "amadeus-" + id;
            f.airlineCode = carrier;
            f.airlineName = carrier;
            f.airlineLogoUrl = Flight.airlineLogo(carrier);
            f.flightNumber = fn;
            f.origin = depIata;
            f.destination = arrIata;
            f.departureTime = depAt.length() >= 16 ? depAt.substring(11, 16) : depAt;
            f.arrivalTime = arrAt.length() >= 16 ? arrAt.substring(11, 16) : arrAt;
            f.durationMinutes = durMin;
            f.stops = stops;
            f.price = price;
            f.currency = cur;
            f.rawSource = "amadeus";
            f.rawOffer = offer; // Keep full JSON for pricing/booking
            list.add(f);
        }
        return list;
    }

    /** Exposed for pricing / booking endpoints on the HTTP server. */
    public String getAmadeusToken() throws Exception {
        if (amadeusKey == null || amadeusKey.isEmpty() || amadeusSecret == null || amadeusSecret.isEmpty()) {
            throw new IllegalStateException("AMADEUS_API_KEY and AMADEUS_API_SECRET must be set");
        }
        long now = System.currentTimeMillis();
        if (amadeusToken != null && now < amadeusTokenExpiryMs - 60_000) {
            return amadeusToken;
        }
        String form = "grant_type=client_credentials&client_id=" + urlEnc(amadeusKey) + "&client_secret=" + urlEnc(amadeusSecret);
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(amadeusBase + "/v1/security/oauth2/token"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form))
                .timeout(Duration.ofSeconds(30))
                .build();
        HttpResponse<String> resp = HTTP.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() >= 400) throw new RuntimeException("Amadeus auth failed: " + resp.body());
        JsonObject o = JsonParser.parseString(resp.body()).getAsJsonObject();
        amadeusToken = o.get("access_token").getAsString();
        int expires = o.has("expires_in") ? o.get("expires_in").getAsInt() : 1800;
        amadeusTokenExpiryMs = now + expires * 1000L;
        return amadeusToken;
    }

    private void enrichAirlineNamesFromAmadeus(String token, List<Flight> flights) {
        Set<String> codes = flights.stream()
                .map(f -> f.airlineCode)
                .filter(c -> c != null && !c.isEmpty() && !"XX".equals(c))
                .collect(Collectors.toSet());
        if (codes.isEmpty()) return;
        Map<String, String> names = fetchAmadeusAirlineNameMap(token, codes);
        for (Flight f : flights) {
            String n = names.get(f.airlineCode);
            if (n != null && !n.isBlank()) {
                f.airlineName = n;
            }
        }
    }

    private Map<String, String> fetchAmadeusAirlineNameMap(String token, Set<String> codes) {
        Map<String, String> map = new HashMap<>();
        List<String> list = new ArrayList<>(codes);
        for (int i = 0; i < list.size(); i += 20) {
            int end = Math.min(i + 20, list.size());
            String joined = String.join(",", list.subList(i, end));
            String url = amadeusBase + "/v1/reference-data/airlines?airlineCodes=" + urlEnc(joined);
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + token)
                    .GET()
                    .timeout(Duration.ofSeconds(30))
                    .build();
            try {
                HttpResponse<String> resp = HTTP.send(req, HttpResponse.BodyHandlers.ofString());
                if (resp.statusCode() >= 400) continue;
                JsonObject root = JsonParser.parseString(resp.body()).getAsJsonObject();
                JsonArray data = root.getAsJsonArray("data");
                if (data == null) continue;
                for (JsonElement el : data) {
                    JsonObject o = el.getAsJsonObject();
                    String iata = o.has("iataCode") ? o.get("iataCode").getAsString() : "";
                    String common = o.has("commonName") ? o.get("commonName").getAsString() : "";
                    if (common.isEmpty() && o.has("businessName")) {
                        common = o.get("businessName").getAsString();
                    }
                    if (!iata.isEmpty() && !common.isEmpty()) {
                        map.put(iata, common);
                    }
                }
            } catch (Exception e) {
                System.err.println("[Amadeus airlines dict] " + e.getMessage());
            }
        }
        return map;
    }

    /**
     * Duffel — live bookable offers (NDC / multi-source), indie-friendly alternative to legacy GDS-only flows.
     * https://duffel.com/docs/api
     */
    private List<Flight> fetchDuffel(String origin, String destination, String date, int adults,
                                     String currency, String cabinClass) throws Exception {
        if (duffelToken.isEmpty()) return Collections.emptyList();

        JsonArray passengers = new JsonArray();
        for (int i = 0; i < adults; i++) {
            JsonObject p = new JsonObject();
            p.addProperty("type", "adult");
            passengers.add(p);
        }
        JsonObject slice = new JsonObject();
        slice.addProperty("origin", origin);
        slice.addProperty("destination", destination);
        slice.addProperty("departure_date", date);
        JsonArray slices = new JsonArray();
        slices.add(slice);

        JsonObject inner = new JsonObject();
        inner.add("slices", slices);
        inner.add("passengers", passengers);
        inner.addProperty("cabin_class", mapDuffelCabin(cabinClass));

        JsonObject wrap = new JsonObject();
        wrap.add("data", inner);
        String bodyJson = GSON.toJson(wrap);

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(duffelBase + "/air/offer_requests"))
                .header("Authorization", "Bearer " + duffelToken)
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .header("Duffel-Version", "v2")
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson))
                .timeout(Duration.ofSeconds(90))
                .build();
        HttpResponse<String> resp = HTTP.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() >= 400) {
            throw new RuntimeException("Duffel HTTP " + resp.statusCode() + ": " + resp.body());
        }
        JsonObject respRoot = JsonParser.parseString(resp.body()).getAsJsonObject();
        JsonObject respData = respRoot.getAsJsonObject("data");
        if (respData == null) return Collections.emptyList();

        JsonArray offers = respData.getAsJsonArray("offers");
        String orqId = respData.has("id") ? respData.get("id").getAsString() : null;

        if ((offers == null || offers.isEmpty()) && orqId != null) {
            offers = pollDuffelOffers(orqId);
        }
        if (offers == null || offers.isEmpty()) return Collections.emptyList();

        List<Flight> list = new ArrayList<>();
        int max = Math.min(offers.size(), 25);
        for (int i = 0; i < max; i++) {
            Flight f = parseDuffelOffer(offers.get(i).getAsJsonObject());
            if (f != null) list.add(f);
        }
        return list;
    }

    private JsonArray pollDuffelOffers(String offerRequestId) throws InterruptedException {
        for (int attempt = 0; attempt < 12; attempt++) {
            Thread.sleep(800);
            try {
                HttpRequest rq = HttpRequest.newBuilder()
                        .uri(URI.create(duffelBase + "/air/offer_requests/" + urlEnc(offerRequestId)))
                        .header("Authorization", "Bearer " + duffelToken)
                        .header("Accept", "application/json")
                        .header("Duffel-Version", "v2")
                        .GET()
                        .timeout(Duration.ofSeconds(60))
                        .build();
                HttpResponse<String> r1 = HTTP.send(rq, HttpResponse.BodyHandlers.ofString());
                if (r1.statusCode() < 400) {
                    JsonObject root1 = JsonParser.parseString(r1.body()).getAsJsonObject();
                    JsonObject dataObj = root1.getAsJsonObject("data");
                    if (dataObj != null) {
                        JsonArray embedded = dataObj.getAsJsonArray("offers");
                        if (embedded != null && !embedded.isEmpty()) return embedded;
                    }
                }
            } catch (Exception e) {
                System.err.println("[Duffel poll orq] " + e.getMessage());
            }
            try {
                String url = duffelBase + "/air/offers?offer_request_id=" + urlEnc(offerRequestId) + "&limit=50";
                HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .header("Authorization", "Bearer " + duffelToken)
                        .header("Accept", "application/json")
                        .header("Duffel-Version", "v2")
                        .GET()
                        .timeout(Duration.ofSeconds(60))
                        .build();
                HttpResponse<String> resp = HTTP.send(req, HttpResponse.BodyHandlers.ofString());
                if (resp.statusCode() >= 400) continue;
                JsonObject root = JsonParser.parseString(resp.body()).getAsJsonObject();
                JsonArray data = root.getAsJsonArray("data");
                if (data != null && !data.isEmpty()) return data;
            } catch (Exception e) {
                System.err.println("[Duffel poll offers] " + e.getMessage());
            }
        }
        return null;
    }

    private Flight parseDuffelOffer(JsonObject offer) {
        try {
            String id = offer.get("id").getAsString();
            double amount = Double.parseDouble(offer.get("total_amount").getAsString());
            String cur = offer.get("total_currency").getAsString();

            JsonArray offerSlices = offer.getAsJsonArray("slices");
            if (offerSlices == null || offerSlices.isEmpty()) return null;
            JsonObject firstSlice = offerSlices.get(0).getAsJsonObject();
            JsonArray segments = firstSlice.getAsJsonArray("segments");
            if (segments == null || segments.isEmpty()) return null;

            int stops = Math.max(0, segments.size() - 1);
            JsonObject seg0 = segments.get(0).getAsJsonObject();
            JsonObject lastSeg = segments.get(segments.size() - 1).getAsJsonObject();

            String depAt = seg0.get("departing_at").getAsString();
            String arrAt = lastSeg.get("arriving_at").getAsString();
            String depIata = seg0.getAsJsonObject("origin").get("iata_code").getAsString();
            String arrIata = lastSeg.getAsJsonObject("destination").get("iata_code").getAsString();

            JsonObject mcarrier = seg0.getAsJsonObject("marketing_carrier");
            String code = mcarrier.get("iata_code").getAsString();
            String name = mcarrier.has("name") ? mcarrier.get("name").getAsString() : code;
            String fnum = seg0.has("marketing_carrier_flight_number")
                    ? seg0.get("marketing_carrier_flight_number").getAsString()
                    : "";

            String durIso = firstSlice.has("duration") && !firstSlice.get("duration").isJsonNull()
                    ? firstSlice.get("duration").getAsString()
                    : null;
            int durMin = durIso != null && durIso.startsWith("PT") ? parseIsoDuration(durIso) : estimateMinutes(depAt, arrAt);
            if (durMin <= 0) durMin = estimateMinutes(depAt, arrAt);

            Flight f = new Flight();
            f.id = "duffel-" + id;
            f.airlineCode = code;
            f.airlineName = name;
            f.airlineLogoUrl = Flight.airlineLogo(code);
            f.flightNumber = code + fnum;
            f.origin = depIata;
            f.destination = arrIata;
            f.departureTime = depAt.length() >= 16 ? depAt.substring(11, 16) : depAt;
            f.arrivalTime = arrAt.length() >= 16 ? arrAt.substring(11, 16) : arrAt;
            f.durationMinutes = durMin;
            f.stops = stops;
            f.price = amount;
            f.currency = cur;
            f.rawSource = "duffel";
            f.rawOffer = offer;
            return f;
        } catch (Exception e) {
            System.err.println("[Duffel parse] " + e.getMessage());
            return null;
        }
    }

    private List<Flight> fetchAviationStack(String origin, String destination, String date) throws Exception {
        if (aviationStackKey.isEmpty()) return Collections.emptyList();
        String url = "http://api.aviationstack.com/v1/flights?access_key=" + urlEnc(aviationStackKey)
                + "&dep_iata=" + urlEnc(origin)
                + "&arr_iata=" + urlEnc(destination)
                + "&flight_date=" + urlEnc(date);
        HttpRequest req = HttpRequest.newBuilder().uri(URI.create(url)).GET().timeout(Duration.ofSeconds(60)).build();
        HttpResponse<String> resp = HTTP.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() >= 400) throw new RuntimeException("AviationStack HTTP " + resp.statusCode());
        JsonObject root = JsonParser.parseString(resp.body()).getAsJsonObject();
        if (root.has("error")) {
            throw new RuntimeException(root.get("error").toString());
        }
        JsonArray data = root.getAsJsonArray("data");
        List<Flight> list = new ArrayList<>();
        if (data == null) return list;
        int idx = 0;
        for (JsonElement el : data) {
            JsonObject fl = el.getAsJsonObject();
            JsonObject dep = fl.has("departure") ? fl.getAsJsonObject("departure") : null;
            JsonObject arr = fl.has("arrival") ? fl.getAsJsonObject("arrival") : null;
            if (dep == null || arr == null) continue;

            String iataFn = "FL";
            if (fl.has("flight")) {
                JsonObject flight = fl.getAsJsonObject("flight");
                if (flight.has("iata")) iataFn = flight.get("iata").getAsString();
            }
            String airlineIata = "XX";
            String airlineName = "Unknown";
            if (fl.has("airline")) {
                JsonObject al = fl.getAsJsonObject("airline");
                if (al.has("iata")) airlineIata = al.get("iata").getAsString();
                if (al.has("name")) airlineName = al.get("name").getAsString();
                else airlineName = airlineIata;
            }

            String depTime = dep.has("scheduled") ? dep.get("scheduled").getAsString() : "";
            String arrTime = arr.has("scheduled") ? arr.get("scheduled").getAsString() : "";
            String depIata = dep.has("iata") ? dep.get("iata").getAsString() : origin;
            String arrIata = arr.has("iata") ? arr.get("iata").getAsString() : destination;

            Flight f = new Flight();
            f.id = "avstack-" + date + "-" + idx + "-" + iataFn;
            f.airlineCode = airlineIata;
            f.airlineName = airlineName;
            f.airlineLogoUrl = Flight.airlineLogo(airlineIata);
            f.flightNumber = iataFn;
            f.origin = depIata;
            f.destination = arrIata;
            f.departureTime = depTime.length() >= 16 ? depTime.substring(11, 16) : depTime;
            f.arrivalTime = arrTime.length() >= 16 ? arrTime.substring(11, 16) : arrTime;
            f.durationMinutes = estimateMinutes(depTime, arrTime);
            f.stops = 0;
            f.price = 0;
            f.currency = "INR";
            f.rawSource = "aviationstack";
            list.add(f);
            idx++;
            if (idx >= 15) break;
        }
        return list;
    }

    private static int parseIsoDuration(String iso) {
        if (iso == null || !iso.startsWith("PT")) return 0;
        int h = 0;
        int m = 0;
        String s = iso.substring(2);
        int hi = s.indexOf('H');
        int mi = s.indexOf('M');
        try {
            if (hi >= 0) h = Integer.parseInt(s.substring(0, hi));
            if (mi >= 0) {
                int start = hi >= 0 ? hi + 1 : 0;
                m = Integer.parseInt(s.substring(start, mi));
            }
        } catch (NumberFormatException ignored) {
            return 0;
        }
        return h * 60 + m;
    }

    private static int estimateMinutes(String dep, String arr) {
        try {
            ZonedDateTime d = ZonedDateTime.parse(dep);
            ZonedDateTime a = ZonedDateTime.parse(arr);
            return (int) ChronoUnit.MINUTES.between(d, a);
        } catch (Exception e) {
            return 120;
        }
    }

    private static String urlEnc(String s) {
        return URLEncoder.encode(s == null ? "" : s, StandardCharsets.UTF_8);
    }

    // Enhanced caching and ranking methods
    private String generateCacheKey(String origin, String destination, String date, int adults, String currency, String cabinClass) {
        return String.join("|", origin, destination, date, String.valueOf(adults), currency, cabinClass);
    }

    private List<Flight> getCachedResults(String cacheKey) {
        Long timestamp = cacheTimestamps.get(cacheKey);
        if (timestamp != null && (System.currentTimeMillis() - timestamp) < CACHE_TTL_MS) {
            return searchCache.get(cacheKey);
        }
        return null;
    }

    private Map<String, Object> buildResultFromCache(List<Flight> cachedResults) {
        List<Map<String, Object>> out = new ArrayList<>();
        for (Flight f : cachedResults) {
            out.add(flightToMap(f));
        }
        
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("flights", out);
        result.put("cached", true);
        result.put("live_sources", List.of("cached_results"));
        result.put("dataset", "live_aviation_apis");
        result.put("pricing_source", "cached_data");
        return result;
    }

    private void cacheResults(String cacheKey, List<Flight> flights) {
        searchCache.put(cacheKey, new ArrayList<>(flights));
        cacheTimestamps.put(cacheKey, System.currentTimeMillis());
        
        // Cleanup old cache entries periodically
        if (searchCache.size() > 1000) {
            cleanupCache();
        }
    }

    private void cleanupCache() {
        long currentTime = System.currentTimeMillis();
        cacheTimestamps.entrySet().removeIf(entry -> 
            (currentTime - entry.getValue()) > CACHE_TTL_MS);
        searchCache.entrySet().removeIf(entry -> 
            !cacheTimestamps.containsKey(entry.getKey()));
    }

    private double calculateRankingScore(Flight flight, double basePrice) {
        double priceScore = (flight.price / Math.max(basePrice, 1)) * 0.4;
        double durationScore = (flight.durationMinutes / 120.0) * 0.3; // Normalize to 2 hours
        double stopsScore = flight.stops * 0.2;
        double airlineScore = getAirlineScore(flight.airlineCode) * 0.1;
        
        return priceScore + durationScore + stopsScore + airlineScore;
    }

    private double getAirlineScore(String airlineCode) {
        // Premium airlines get better scores
        if (airlineCode == null) return 0.5;
        String code = airlineCode.toUpperCase();
        switch (code) {
            case "SQ": case "EK": case "QR": case "EY": return 0.1; // Premium
            case "LH": case "BA": case "AF": case "KL": return 0.2; // Major European
            case "UA": case "DL": case "AA": return 0.2; // Major US
            case "6E": case "SG": case "G8": return 0.4; // Indian LCCs
            default: return 0.3; // Average
        }
    }

    private Map<String, Object> flightToMap(Flight f) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", f.id);
        m.put("airline_code", f.airlineCode);
        m.put("airline_name", f.airlineName);
        m.put("airline_logo_url", f.airlineLogoUrl);
        m.put("flight_number", f.flightNumber);
        m.put("origin", f.origin);
        m.put("destination", f.destination);
        m.put("departure_time", f.departureTime);
        m.put("arrival_time", f.arrivalTime);
        m.put("duration_minutes", f.durationMinutes);
        m.put("stops", f.stops);
        m.put("price", f.price);
        m.put("currency", f.currency);
        m.put("raw_source", f.rawSource);
        if (f.rawOffer != null && f.rawSource != null
                && ("amadeus".equals(f.rawSource) || "duffel".equals(f.rawSource))) {
            try {
                m.put("raw_offer", GSON.fromJson(GSON.toJsonTree(f.rawOffer), Map.class));
            } catch (Exception e) {
                System.err.println("[flightToMap raw_offer] " + e.getMessage());
            }
        }
        return m;
    }

    public void shutdown() {
        executor.shutdown();
    }
}
