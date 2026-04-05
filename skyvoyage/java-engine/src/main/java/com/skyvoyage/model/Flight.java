package com.skyvoyage.model;

import java.util.Objects;

/**
 * Normalized flight offer for API responses.
 */
public class Flight {
    public String id;
    public String airlineCode;
    public String airlineName;
    public String airlineLogoUrl;
    public String flightNumber;
    public String origin;
    public String destination;
    public String departureTime;
    public String arrivalTime;
    public int durationMinutes;
    public int stops;
    public double price;
    public String currency;
    public String rawSource;
    public Object rawOffer; // Original Amadeus/AviationStack JSON for booking
    public double rankingScore; // For intelligent flight ranking

    public Flight() {}

    public Flight(String id, String airlineCode, String airlineName, String flightNumber,
                String origin, String destination, String departureTime, String arrivalTime,
                int durationMinutes, int stops, double price, String currency, String rawSource, Object rawOffer) {
        this.id = id;
        this.airlineCode = airlineCode;
        this.airlineName = airlineName;
        this.airlineLogoUrl = airlineLogo(airlineCode);
        this.flightNumber = flightNumber;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.durationMinutes = durationMinutes;
        this.stops = stops;
        this.price = price;
        this.currency = currency;
        this.rawSource = rawSource;
        this.rawOffer = rawOffer;
    }

    public static String airlineLogo(String iata) {
        if (iata == null || iata.isEmpty()) {
            return "";
        }
        return "https://www.gstatic.com/flights/airline_logos/70px/" + iata + ".png";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Flight flight)) return false;
        return Objects.equals(id, flight.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
