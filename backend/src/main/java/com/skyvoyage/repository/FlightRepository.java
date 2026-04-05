package com.skyvoyage.repository;

import com.skyvoyage.model.Flight;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightRepository extends MongoRepository<Flight, String> {
    
    /**
     * Find flights by departure airport
     */
    List<Flight> findByDepartureAirport(String departureAirport);
    
    /**
     * Find flights by arrival airport
     */
    List<Flight> findByArrivalAirport(String arrivalAirport);
    
    /**
     * Find flights by airline code
     */
    List<Flight> findByAirlineCode(String airlineCode);
    
    /**
     * Find flights by price range
     */
    List<Flight> findByPriceBetween(double minPrice, double maxPrice);
    
    /**
     * Find flights by number of stops
     */
    List<Flight> findByStops(int stops);
    
    /**
     * Find flights by departure time range
     */
    List<Flight> findByDepartureTimeBetween(String startTime, String endTime);
}
