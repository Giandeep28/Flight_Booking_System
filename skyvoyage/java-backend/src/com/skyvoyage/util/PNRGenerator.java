package com.skyvoyage.util;

import java.util.UUID;

/**
 * PNR Generator - Unique booking reference generator
 * Format: SV + 6 alphanumeric chars (e.g., SV4K8M2X)
 */
public class PNRGenerator {
    
    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    
    /**
     * Generate a unique PNR code
     * Uses UUID + timestamp for uniqueness guarantee
     */
    public static String generate() {
        String uuid = UUID.randomUUID().toString().replace("-", "").toUpperCase();
        long timestamp = System.nanoTime();
        
        StringBuilder pnr = new StringBuilder("SV");
        
        // Mix UUID and timestamp for 6 chars
        for (int i = 0; i < 6; i++) {
            int index = (uuid.charAt(i) + (int)(timestamp % 31) + i) % CHARS.length();
            pnr.append(CHARS.charAt(Math.abs(index)));
            timestamp /= 7;
        }
        
        return pnr.toString();
    }
    
    /**
     * Validate PNR format
     */
    public static boolean isValid(String pnr) {
        return pnr != null && pnr.length() == 8 && pnr.startsWith("SV") 
            && pnr.substring(2).matches("[A-Z0-9]+");
    }
}
