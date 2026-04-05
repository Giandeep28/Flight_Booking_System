package com.skyvoyage.model;

import java.util.List;
import java.util.Map;

public class Booking {
    public String pnr;
    public String userId;
    public String flightId;
    public List<Map<String, Object>> passengers;
    public String status;

    public Booking() {}
}
