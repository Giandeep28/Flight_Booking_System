import java.io.*;
import java.nio.file.*;
import java.util.concurrent.*;
import java.util.concurrent.locks.ReentrantLock;
import java.util.*;

/**
 * SkyVoyage Core Booking Engine
 * Optimized for Enterprise Performance using Deep OOP & Multithreading
 */
public class BookingEngine {
    private static final String TICKET_PATH = "./tickets/";
    private static final Map<String, ReentrantLock> seatLocks = new ConcurrentHashMap<>();
    private static final Set<String> lockedSeats = Collections.synchronizedSet(new HashSet<>());

    // Thread pool for processing multiple booking requests concurrently
    private static final ExecutorService scheduler = Executors.newFixedThreadPool(10);

    public static void main(String[] args) {
        if (args.length < 3) {
            System.err.println("Usage: java BookingEngine <action> <flight_id> <seat_id> <passenger_name>");
            return;
        }

        String action = args[0];
        String flightId = args[1];
        String seatId = args[2];
        String passengerName = args.length > 3 ? args[3] : "Valued Guest";

        if (action.equalsIgnoreCase("lock")) {
            processBooking(flightId, seatId, passengerName);
        }
    }

    public static void processBooking(String flightId, String seatId, String passengerName) {
        String seatKey = flightId + "_" + seatId;
        
        // Ensure atomic seat locking utilizing ReentrantLock
        seatLocks.putIfAbsent(seatKey, new ReentrantLock());
        ReentrantLock lock = seatLocks.get(seatKey);

        scheduler.execute(() -> {
            if (lock.tryLock()) {
                try {
                    if (lockedSeats.contains(seatKey)) {
                        System.out.println("FAILED: Seat " + seatId + " is already occupied.");
                        return;
                    }

                    // Simulate critical processing time
                    System.out.println("LOCKING: Processing seat " + seatId + " for " + passengerName + "...");
                    Thread.sleep(2000);

                    lockedSeats.add(seatKey);
                    generateETicket(flightId, seatId, passengerName);
                    System.out.println("SUCCESS: Ticket generated for PNR SKY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

                } catch (InterruptedException | IOException e) {
                    System.err.println("ERROR: Booking process interrupted - " + e.getMessage());
                } finally {
                    lock.unlock();
                }
            } else {
                System.out.println("CONFLICT: Another transaction is currently locking seat " + seatId);
            }
        });

        // Graceful shutdown after tasks
        scheduler.shutdown();
    }

    /**
     * File Handling: Generates a persistent PDF e-ticket
     */
    private static void generateETicket(String flightId, String seatId, String passengerName) throws IOException {
        Path directory = Paths.get(TICKET_PATH);
        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
        }

        String fileName = "TICKET_" + flightId + "_" + seatId + "_" + System.currentTimeMillis() + ".pdf";
        File ticket = new File(TICKET_PATH + fileName);

        try (PrintWriter writer = new PrintWriter(new FileWriter(ticket))) {
            writer.println("%PDF-1.4 (Mock SkyVoyage Ticket)");
            writer.println("PASSENGER: " + passengerName);
            writer.println("FLIGHT: " + flightId);
            writer.println("SEAT: " + seatId);
            writer.println("PNR: " + UUID.randomUUID().toString().toUpperCase());
            writer.println("DATE: " + new java.util.Date());
            writer.println("STATUS: SECURELY CONFIRMED");
            writer.println("%%EOF");
        }
        System.out.println("FILE_STORED: " + ticket.getAbsolutePath());
    }
}
