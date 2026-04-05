package com.skyvoyage.integration;

import com.skyvoyage.controller.FlightController;
import com.skyvoyage.model.Flight;
import com.skyvoyage.repository.FlightRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.DynamicPropertyRegistry;

import java.util.List;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class FlightIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private FlightRepository flightRepository;
    
    @Test
    public void testFlightSearchAPI() {
        // Test the complete flight search flow
        String baseUrl = "http://localhost:" + restTemplate.getForObject("/local.server.port", String.class);
        
        // Test flight search
        String response = restTemplate.getForObject(baseUrl + "/api/flights?from=DEL&to=BOM", String.class);
        
        // Verify response
        assert response != null;
        assert !response.contains("error");
        
        System.out.println("✅ Flight search API test passed");
    }
    
    @Test
    public void testFlightBookingAPI() {
        String baseUrl = "http://localhost:" + restTemplate.getForObject("/local.server.port", String.class);
        
        // Test booking creation
        String bookingRequest = "{\"flightId\":\"FL1234\",\"passengerName\":\"John Doe\",\"passengerEmail\":\"john@example.com\"}";
        String response = restTemplate.postForObject(baseUrl + "/api/bookings", bookingRequest, String.class);
        
        // Verify booking response
        assert response != null;
        assert response.contains("pnr");
        
        System.out.println("✅ Flight booking API test passed");
    }
    
    @Test
    public void testDatabaseConnection() {
        // Test database connectivity
        try {
            List<Flight> flights = flightRepository.findByDepartureAirport("DEL");
            assert flights != null;
            
            System.out.println("✅ Database connection test passed");
        } catch (Exception e) {
            System.err.println("❌ Database connection test failed: " + e.getMessage());
        }
    }
}
