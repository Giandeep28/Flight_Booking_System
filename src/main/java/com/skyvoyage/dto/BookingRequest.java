package com.skyvoyage.dto;

import javax.validation.constraints.*;

public class BookingRequest {
    
    @NotBlank(message = "Flight ID is required")
    private String flightId;
    
    @NotBlank(message = "Passenger name is required")
    private String passengerName;
    
    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String passengerEmail;
    
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Valid phone number is required")
    @NotBlank(message = "Phone number is required")
    private String passengerPhone;
    
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "Seat ID is required")
    private String seatId;
    
    private String cabinClass;
    private String bookingClass;
    
    // Getters and setters
    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public String getPassengerEmail() { return passengerEmail; }
    public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }
    public String getPassengerPhone() { return passengerPhone; }
    public void setPassengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getSeatId() { return seatId; }
    public void setSeatId(String seatId) { this.seatId = seatId; }
    public String getCabinClass() { return cabinClass; }
    public void setCabinClass(String cabinClass) { this.cabinClass = cabinClass; }
    public String getBookingClass() { return bookingClass; }
    public void setBookingClass(String bookingClass) { this.bookingClass = bookingClass; }
}
