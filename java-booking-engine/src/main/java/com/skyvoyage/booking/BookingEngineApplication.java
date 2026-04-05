package com.skyvoyage.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * SkyVoyage Booking Engine Application
 * 
 * Enterprise-grade multithreaded flight booking system with:
 * - Concurrent seat locking mechanism
 * - High-performance booking processing
 * - PDF e-ticket generation
 * - MongoDB integration for persistence
 * - Thread-safe operations
 * 
 * @author SkyVoyage Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableAsync
@EnableScheduling
public class BookingEngineApplication {

    public static void main(String[] args) {
        System.out.println("""
        
╔══════════════════════════════════════════════════════════════╗
║                SKYVOYAGE BOOKING ENGINE v1.0.0                ║
║                                                              ║
║  🚀 Enterprise Multithreaded Booking System                ║
║  🔄 Concurrent Seat Locking Mechanism                      ║
║  📄 PDF E-Ticket Generation                               ║
║  🗄️ MongoDB Persistence                                    ║
║  ⚡ High-Performance Thread-Safe Operations                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
        """);
        
        SpringApplication.run(BookingEngineApplication.class, args);
    }
}
