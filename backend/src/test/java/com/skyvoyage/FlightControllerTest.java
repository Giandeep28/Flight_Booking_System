package com.skyvoyage;

import com.skyvoyage.controller.FlightController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class FlightControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    public void testGetFlights() throws Exception {
        mockMvc.perform(get("/api/flights"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flights").exists());
    }
    
    @Test
    public void testCreateBooking() throws Exception {
        mockMvc.perform(post("/api/bookings")
                .contentType("application/json")
                .content("{\"flightId\":\"FL1234\",\"passengerName\":\"John Doe\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pnr").exists());
    }
    
    @Test
    public void testGetBooking() throws Exception {
        mockMvc.perform(get("/api/bookings/ABC123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pnr").value("ABC123"));
    }
}
