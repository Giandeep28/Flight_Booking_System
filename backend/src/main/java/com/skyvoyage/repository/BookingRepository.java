package com.skyvoyage.repository;

import com.skyvoyage.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    /**
     * Find bookings by passenger email
     */
    List<Booking> findByPassengerEmail(String passengerEmail);
    
    /**
     * Find bookings by passenger name
     */
    List<Booking> findByPassengerName(String passengerName);
    
    /**
     * Find bookings by PNR
     */
    Booking findByPnr(String pnr);
    
    /**
     * Find bookings by status
     */
    List<Booking> findByStatus(String status);
    
    /**
     * Find bookings by booking date range
     */
    List<Booking> findByBookingDateBetween(String startDate, String endDate);
}
