import { expect, test } from '@playwright/test';
import { INTEGRATIONS_PATH, dismissCookieConsent } from './test-utils';
import { generateCommunicationPayload, generateWebhookPayload } from './utils/data-generators';
import {
  deleteIntegration,
  fillCommunicationForm,
  fillWebhookForm,
  waitForSuccessNotification,
} from './utils/form-helpers';

/**
 * Integrations UI E2E Test Suite
 *
 * Pure UI tests - no API calls. Tests the full user journey:
 * - Create via UI wizard
 * - Verify in UI table
 * - Delete via UI
 */

// =============================================================================
// Navigation Tests
// =============================================================================

test.describe('Integrations Navigation', () => {
  test('should navigate across all tabs', async ({ page }) => {
    await page.goto(INTEGRATIONS_PATH);
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/settings\/integrations/);

    await test.step('Communications tab loads', async () => {
      const communicationsTab = page
        .locator('button:has-text("Communications"), a:has-text("Communications")')
        .first();
      await expect(communicationsTab).toBeVisible({ timeout: 5000 });
      await communicationsTab.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/communications/);
    });

    await test.step('Reporting tab loads', async () => {
      const reportingTab = page
        .locator('button:has-text("Reporting"), a:has-text("Reporting")')
        .first();
      await expect(reportingTab).toBeVisible({ timeout: 5000 });
      await reportingTab.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/reporting/);
    });

    await test.step('Webhooks tab loads', async () => {
      const webhooksTab = page
        .locator('button:has-text("Webhooks"), a:has-text("Webhooks")')
        .first();
      await expect(webhooksTab).toBeVisible({ timeout: 5000 });
      await webhooksTab.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/webhooks/);
    });
  });
});

// =============================================================================
// Webhook Creation Tests
// =============================================================================

test.describe('Webhook Integration Lifecycle', () => {
  test('should create, verify, and delete webhook integration', async ({ page }) => {
    const webhookPayload = generateWebhookPayload({ eventTypes: ['New recommendation'] });

    // Navigate to integrations page
    await page.goto(INTEGRATIONS_PATH);
    await page.waitForLoadState('domcontentloaded');

    await dismissCookieConsent(page);

    // Click "Create Integration" dropdown button (use .first() as there may be multiple)
    const createButton = page.getByRole('button', { name: 'Create Integration' }).first();
    await createButton.waitFor({ state: 'visible', timeout: 10000 });
    await createButton.click();

    // Click "Webhooks" from the dropdown menu
    const webhooksMenuItem = page
      .getByRole('menuitem', { name: 'Webhooks' })
      .or(page.locator('a:has-text("Webhooks")'));
    await webhooksMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    await webhooksMenuItem.click();

    // Wait for wizard dialog to open
    await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 10000 });

    // Fill the webhook form
    await fillWebhookForm(page, webhookPayload);
    await waitForSuccessNotification(page);

    // Wait for modal to close
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 10000 });

    // Navigate to Webhooks tab to verify the webhook appears
    const webhooksTab = page.locator('button:has-text("Webhooks"), a:has-text("Webhooks")').first();
    await webhooksTab.click();
    await page.waitForLoadState('domcontentloaded');

    // Verify webhook appears in the list
    const webhookElement = page.locator(`text="${webhookPayload.name}"`).first();
    await expect(webhookElement).toBeVisible({ timeout: 10000 });

    // Delete the webhook
    await deleteIntegration(page, webhookPayload.name);

    // Verify it's gone
    await expect(webhookElement).not.toBeVisible({ timeout: 10000 });
  });
});

// =============================================================================
// Communication Integration Tests
// =============================================================================

test.describe('Communication Integration Lifecycle', () => {
  test('should create, verify, and delete Slack integration', async ({ page }) => {
    const payload = generateCommunicationPayload('slack', { eventTypes: ['New recommendation'] });

    // Navigate to integrations page
    await page.goto(INTEGRATIONS_PATH);
    await page.waitForLoadState('domcontentloaded');

    await dismissCookieConsent(page);

    // Click "Create Integration" dropdown button (same pattern as webhook)
    const createButton = page.getByRole('button', { name: 'Create Integration' }).first();
    await createButton.waitFor({ state: 'visible', timeout: 10000 });
    await createButton.click();

    // Click "Communications" from the dropdown menu
    const communicationsMenuItem = page
      .getByRole('menuitem', { name: 'Communications' })
      .or(page.locator('a:has-text("Communications")'));
    await communicationsMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    await communicationsMenuItem.click();

    // Wait for wizard dialog to open
    await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 10000 });

    // Fill the communication form
    await fillCommunicationForm(page, payload);
    await waitForSuccessNotification(page);

    // Wait for modal to close
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 10000 });

    // Navigate to Communications tab to verify the integration appears
    const communicationsTab = page
      .locator('button:has-text("Communications"), a:has-text("Communications")')
      .first();
    await communicationsTab.click();
    await page.waitForLoadState('domcontentloaded');

    // Verify integration appears in the list
    const integrationElement = page.locator(`text="${payload.name}"`).first();
    await expect(integrationElement).toBeVisible({ timeout: 10000 });

    // Delete the integration
    await deleteIntegration(page, payload.name);

    // Verify it's gone
    await expect(integrationElement).not.toBeVisible({ timeout: 10000 });
  });
});
