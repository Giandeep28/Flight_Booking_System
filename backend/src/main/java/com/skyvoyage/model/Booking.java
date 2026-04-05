package com.skyvoyage.model;

import java.time.LocalDateTime;

public class Booking {
    private String pnr;
    private String flightId;
    private String passengerName;
    private String passengerEmail;
    private String passengerPhone;
    private LocalDateTime bookingDate;
    private String status;
    private String seatNumber;
    private double totalAmount;

    // Constructors
    public Booking() {}

    public Booking(String pnr, String flightId, String passengerName, String passengerEmail,
                  String passengerPhone, LocalDateTime bookingDate, String status,
                  String seatNumber, double totalAmount) {
        this.pnr = pnr;
        this.flightId = flightId;
        this.passengerName = passengerName;
        this.passengerEmail = passengerEmail;
        this.passengerPhone = passengerPhone;
        this.bookingDate = bookingDate;
        this.status = status;
        this.seatNumber = seatNumber;
        this.totalAmount = totalAmount;
    }

    // Getters
    public String getPnr() { return pnr; }
    public String getFlightId() { return flightId; }
    public String getPassengerName() { return passengerName; }
    public String getPassengerEmail() { return passengerEmail; }
    public String getPassengerPhone() { return passengerPhone; }
    public LocalDateTime getBookingDate() { return bookingDate; }
    public String getStatus() { return status; }
    public String getSeatNumber() { return seatNumber; }
    public double getTotalAmount() { return totalAmount; }

    // Setters
    public void setPnr(String pnr) { this.pnr = pnr; }
    public void setFlightId(String flightId) { this.flightId = flightId; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }
    public void setPassengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
    public void setStatus(String status) { this.status = status; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
}
