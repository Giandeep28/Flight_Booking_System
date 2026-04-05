const { test, expect } = require('@playwright/test');

/**
 * SkyVoyage Enterprise E2E Test Suite
 * Validates the core booking funnel from search to seat selection.
 */
test.describe('SkyVoyage Booking Funnel', () => {

  test('Should navigate from search to seat selection', async ({ page }) => {
    // 1. Visit Home
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/SkyVoyage/);

    // 2. Select Departure and Destination
    const fromInput = page.locator('input[placeholder="Enter City/Airport"]').first();
    await fromInput.fill('DEL');
    await page.click('text=Delhi (DEL)');

    const toInput = page.locator('input[placeholder="Enter City/Airport"]').last();
    await toInput.fill('BOM');
    await page.click('text=Mumbai (BOM)');

    // 3. Trigger Search
    await page.click('button:has-text("SEARCH FLIGHTS")');
    await expect(page).toHaveURL(/.*results/);

    // 4. Wait for Results and Select Flight
    await page.waitForSelector('text=Results', { timeout: 10000 });
    const selectSeatBtn = page.locator('button:has-text("SELECT SEAT")').first();
    await selectSeatBtn.click();
    await expect(page).toHaveURL(/.*booking/);

    // 5. Fill Passenger Details
    await page.fill('input[placeholder="e.g. John Doe"]', 'Test Passenger');
    await page.fill('input[placeholder="e.g. john@skyvoyage.com"]', 'test@example.com');
    await page.fill('input[placeholder="+91 98765-43210"]', '9999999999');
    await page.click('button:has-text("CONTINUE TO SEATS")');

    // 6. Select a Seat from the Interactive Map
    await page.waitForSelector('text=CHOOSE EXPERIENCE');
    const seat = page.locator('div:has-text("1A")').first();
    await seat.click();
    
    // 7. Verify Selection and Proceed to Payment
    await expect(page.locator('text=Selected Seat')).toBeVisible();
    await expect(page.locator('text=1A')).toBeVisible();
    await page.click('button:has-text("PAYMENT")');

    // 8. Final Check on Payment Page
    await expect(page.locator('text=SECURE CHECKOUT')).toBeVisible();
  });

});
