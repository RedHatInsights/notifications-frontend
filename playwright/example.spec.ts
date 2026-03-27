import { expect, test } from '@playwright/test';
import {
  INTEGRATIONS_PATH,
  NOTIFICATIONS_PATH,
  ensureLoggedIn,
} from './test-utils';

/**
 * Example E2E test for notifications-frontend
 *
 * This is a basic smoke test to verify the application loads.
 * Replace with actual test scenarios for your application.
 */
test.describe('Notifications Frontend', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure user is logged in before each test
    await ensureLoggedIn(page);
  });

  test('should load the notifications page', async ({ page }) => {
    // Navigate to the notifications page
    await page.goto(NOTIFICATIONS_PATH);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Verify the page title or a key element is present
    // TODO: Replace with actual selectors from your application
    await expect(page).toHaveURL(/settings\/notifications/);

    // Take a screenshot for debugging
    await page.screenshot({
      path: 'playwright-results/notifications-page.png',
      fullPage: true,
    });
  });

  test('should load the integrations page', async ({ page }) => {
    // Navigate to the integrations page
    await page.goto(INTEGRATIONS_PATH);

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Verify the page loaded correctly
    await expect(page).toHaveURL(/settings\/integrations/);

    // Take a screenshot for debugging
    await page.screenshot({
      path: 'playwright-results/integrations-page.png',
      fullPage: true,
    });
  });
});
