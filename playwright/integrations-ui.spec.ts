import { expect, test } from '@playwright/test';
import { INTEGRATIONS_PATH } from './test-utils';
import { generateCommunicationPayload, generateWebhookPayload } from './utils/data-generators';
import {
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
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/settings\/integrations/);

    await test.step('Communications tab loads', async () => {
      const communicationsTab = page
        .locator('button:has-text("Communications"), a:has-text("Communications")')
        .first();
      if (await communicationsTab.isVisible()) {
        await communicationsTab.click();
        await page.waitForLoadState('networkidle');
      }
    });

    await test.step('Reporting tab loads', async () => {
      const reportingTab = page
        .locator('button:has-text("Reporting"), a:has-text("Reporting")')
        .first();
      if (await reportingTab.isVisible()) {
        await reportingTab.click();
        await page.waitForLoadState('networkidle');
      }
    });

    await test.step('Webhooks tab loads', async () => {
      const webhooksTab = page
        .locator('button:has-text("Webhooks"), a:has-text("Webhooks")')
        .first();
      if (await webhooksTab.isVisible()) {
        await webhooksTab.click();
        await page.waitForLoadState('networkidle');
      }
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
    await page.waitForLoadState('networkidle');

    // Dismiss cookie consent if it appears
    const acceptCookies = page
      .getByRole('button', { name: 'Accept all' })
      .or(page.getByRole('button', { name: 'Accept' }));
    if (await acceptCookies.isVisible({ timeout: 2000 }).catch(() => false)) {
      await acceptCookies.click();
      await page.waitForTimeout(500);
    }

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

    // Now the wizard dialog should open
    await page.waitForTimeout(1000);

    // Fill the webhook form
    await fillWebhookForm(page, webhookPayload);
    await waitForSuccessNotification(page);

    // Modal closes automatically - wait for it
    await page.waitForTimeout(2000);

    // Navigate to Webhooks tab to verify the webhook appears
    const webhooksTab = page.locator('button:has-text("Webhooks"), a:has-text("Webhooks")').first();
    await webhooksTab.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify webhook appears in the list
    const webhookElement = page.locator(`text="${webhookPayload.name}"`).first();
    await expect(webhookElement).toBeVisible({ timeout: 10000 });

    // Delete the webhook
    const container = page
      .locator('[role="row"], [class*="card"]', {
        has: page.locator(`text="${webhookPayload.name}"`),
      })
      .first();

    const deleteButton = container
      .locator('button[aria-label*="Delete"], button:has-text("Delete")')
      .first();
    if (await deleteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await deleteButton.click();
    } else {
      const kebabButton = container
        .locator('button[aria-label*="Actions"], button[aria-label*="Kebab"]')
        .first();
      await kebabButton.click();
      await page.waitForTimeout(500);
      const deleteMenuItem = page.locator('button:has-text("Delete")').first();
      await deleteMenuItem.click();
    }

    // Confirm deletion
    const confirmButton = page
      .locator('button:has-text("Delete"), button:has-text("Confirm")')
      .first();
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click({ force: true });

    await page.waitForTimeout(2000);
    const webhookGone = await webhookElement.isVisible({ timeout: 2000 }).catch(() => false);
    expect(webhookGone).toBe(false);
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
    await page.waitForLoadState('networkidle');

    // Dismiss cookie consent if it appears
    const acceptCookies = page
      .getByRole('button', { name: 'Accept all' })
      .or(page.getByRole('button', { name: 'Accept' }));
    if (await acceptCookies.isVisible({ timeout: 2000 }).catch(() => false)) {
      await acceptCookies.click();
      await page.waitForTimeout(500);
    }

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

    // Wait for wizard to appear
    await page.waitForTimeout(1000);

    // Fill the communication form (wizard should be open now)
    await fillCommunicationForm(page, payload);
    await waitForSuccessNotification(page);

    // Modal closes automatically - wait for it
    await page.waitForTimeout(2000);

    // Navigate to Communications tab to verify the integration appears
    const communicationsTab = page
      .locator('button:has-text("Communications"), a:has-text("Communications")')
      .first();
    await communicationsTab.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify integration appears in the list
    const integrationElement = page.locator(`text="${payload.name}"`).first();
    await expect(integrationElement).toBeVisible({ timeout: 10000 });

    // Delete the integration
    const container = page
      .locator('[role="row"], [class*="card"]', {
        has: page.locator(`text="${payload.name}"`),
      })
      .first();

    const deleteButton = container
      .locator('button[aria-label*="Delete"], button:has-text("Delete")')
      .first();
    if (await deleteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await deleteButton.click();
    } else {
      const kebabButton = container
        .locator('button[aria-label*="Actions"], button[aria-label*="Kebab"]')
        .first();
      await kebabButton.click();
      await page.waitForTimeout(500);
      const deleteMenuItem = page.locator('button:has-text("Delete")').first();
      await deleteMenuItem.click();
    }

    // Confirm deletion
    const confirmButton = page
      .locator('button:has-text("Delete"), button:has-text("Confirm")')
      .first();
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click({ force: true });

    await page.waitForTimeout(2000);
    const integrationGone = await integrationElement
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    expect(integrationGone).toBe(false);
  });
});
