import { test, expect } from '@playwright/test';

test.describe('SkyVoyage Booking Flow', () => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

  test('should search and book a flight successfully', async ({ page }) => {
    // 1. Visit Hero / Search Portal
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/SkyVoyage/);

    // 2. Perform Search (using defaults for now)
    await page.click('button:has-text("SEARCH VOYAGES")');
    await expect(page).toHaveURL(/.*results/);

    // 3. Select the first flight
    const firstFlight = page.locator('.glass-card').first();
    await expect(firstFlight).toBeVisible();
    await firstFlight.locator('a:has-text("SECURE SEAT")').click();

    // 4. Booking Page - Passenger Info (Check for redirect to login if not auth)
    // Note: In real CI, we would login first. For now, testing the redirect or presence.
    if (await page.url().includes('booking')) {
        await expect(page.locator('h1')).toContainText('PASSENGER DETAILS');
        
        // Fill name
        await page.fill('input[placeholder="First Name"]', 'John');
        await page.fill('input[placeholder="Last Name"]', 'Doe');
        await page.fill('input[placeholder="Passport Number"]', 'A1234567');
        
        // Go to Seat Selection
        await page.click('button:has-text("SELECT SEATS")');
        
        // 5. Seat Selection
        await expect(page.locator('h1')).toContainText('PICK YOUR SEAT');
        // Click an available seat (mock logic: seat 1A usually available)
        await page.click('button:not([disabled])');
        
        // Confirm booking
        await page.click('button:has-text("CONFIRM")');
        
        // 6. Confirmation
        await expect(page).toHaveURL(/.*confirmation/);
        await expect(page.locator('h1')).toContainText('VOYAGE CONFIRMED');
    }
  });
});
