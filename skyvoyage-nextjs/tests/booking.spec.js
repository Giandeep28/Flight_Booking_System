/**
 * SkyVoyage E2E smoke tests — run with stack: Next.js + gateway + Java + Python + MongoDB.
 * Command: npx playwright test tests/booking.spec.js
 */
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

test.describe('SkyVoyage UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
  });

  test('home renders search and primary CTA', async ({ page }) => {
    await expect(page.getByRole('button', { name: /SEARCH FLIGHTS/i })).toBeVisible();
    await expect(page.locator('#from-input')).toBeVisible();
    await expect(page.locator('#to-input')).toBeVisible();
  });

  test('validation when airports not selected', async ({ page }) => {
    await page.getByRole('button', { name: /SEARCH FLIGHTS/i }).click();
    await expect(page.getByText(/Please select departure and destination airports/i)).toBeVisible();
  });
});

test.describe('SkyVoyage full flow (requires live backend)', () => {
  test.skip(
    !process.env.SKYVOYAGE_E2E_LIVE,
    'Set SKYVOYAGE_E2E_LIVE=1 with gateway, Java, Python, MongoDB, and API keys running.'
  );

  test('search navigates to results when backend returns flights', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#from-input').click();
    await page.locator('#from-input').fill('Delhi');
    await page.waitForTimeout(500);
    await page.locator('.airport-item').first().click();

    await page.locator('#to-input').click();
    await page.locator('#to-input').fill('Mumbai');
    await page.waitForTimeout(500);
    await page.locator('.airport-item').first().click();

    const future = new Date();
    future.setDate(future.getDate() + 14);
    await page.locator('#departure-date').fill(future.toISOString().split('T')[0]);

    await page.getByRole('button', { name: /SEARCH FLIGHTS/i }).click();
    await page.waitForURL('**/results', { timeout: 120000 });
    await expect(page.getByText(/FLIGHTS FOUND/i)).toBeVisible();
  });
});
