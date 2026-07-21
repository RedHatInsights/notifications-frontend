import { expect, test } from '@playwright/test';
import { INTEGRATIONS_PATH, dismissCookieConsent, ensureLoggedIn } from './test-utils';
import { generateCommunicationPayload, generateWebhookPayload } from './utils/data-generators';
import { deleteIntegration, fillCommunicationForm, fillWebhookForm } from './utils/form-helpers';

/**
 * Integrations UI E2E Test Suite
 *
 * Tests the complete integration lifecycle through the UI:
 * 1. Navigation - verify all category tabs load correctly
 * 2. Create - fill wizard form and submit
 * 3. Verify - check integration appears in table
 * 4. Delete - remove integration and verify deletion
 */

// =============================================================================
// Navigation Tests
// =============================================================================

test.describe('Integrations Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
  });

  test('should navigate across all tabs', async ({ page }) => {
    // RHCLOUD-48620: chrome tab clicks don't reliably set ?category= URL param.
    // Marked as expected failure until the chrome fix lands — when it passes,
    // Playwright will flag it so we can remove test.fail().
    test.fail();

    // Navigate to integrations page
    await page.goto(INTEGRATIONS_PATH);
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/settings\/integrations/);

    // Wait for page heading with dual-timeout strategy:
    // 1. Quick check (5s) - if heading visible, continue immediately
    // 2. If not visible, reload page (module federation may not have hydrated)
    // 3. Full retry (30s) - expect() auto-retries until heading appears or timeout
    const heading = page.getByRole('heading', { name: 'Integrations' });
    if (!(await heading.isVisible({ timeout: 5000 }))) {
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    }
    await expect(heading).toBeVisible({ timeout: 30000 });

    // Wait for tabs to render
    await page
      .locator('button:has-text("Communications"), a:has-text("Communications")')
      .first()
      .waitFor({ state: 'visible', timeout: 30000 });

    // Test: Navigate to Communications tab
    await test.step('Communications tab loads', async () => {
      const communicationsTab = page
        .locator('button:has-text("Communications"), a:has-text("Communications")')
        .first();
      await expect(communicationsTab).toBeVisible({ timeout: 5000 });
      await communicationsTab.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(communicationsTab).toHaveAttribute('aria-selected', 'true');
      await expect(page).toHaveURL(/settings\/integrations\?.*category=Communications/);
    });

    // Test: Navigate to Reporting tab
    await test.step('Reporting tab loads', async () => {
      const reportingTab = page
        .locator('button:has-text("Reporting"), a:has-text("Reporting")')
        .first();
      await expect(reportingTab).toBeVisible({ timeout: 5000 });
      await reportingTab.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(reportingTab).toHaveAttribute('aria-selected', 'true');
      await expect(page).toHaveURL(/settings\/integrations\?.*category=Reporting/);
    });

    // Test: Navigate to Webhooks tab
    await test.step('Webhooks tab loads', async () => {
      const webhooksTab = page
        .locator('button:has-text("Webhooks"), a:has-text("Webhooks")')
        .first();
      await expect(webhooksTab).toBeVisible({ timeout: 5000 });
      await webhooksTab.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(webhooksTab).toHaveAttribute('aria-selected', 'true');
      await expect(page).toHaveURL(/settings\/integrations\?.*category=Webhooks/);
    });
  });
});

// =============================================================================
// Webhook Creation Tests
// =============================================================================

test.describe('Webhook Integration Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
  });

  test('should create, verify, and delete webhook integration', async ({ page }) => {
    /**
     * Test flow:
     * 1. Open Create Integration dropdown
     * 2. Select Webhooks → fills 3-step wizard (details, event types, review)
     * 3. Navigate to Webhooks tab
     * 4. Verify new webhook appears in table
     * 5. Delete webhook via kebab menu
     * 6. Verify webhook removed from table
     */
    const webhookPayload = generateWebhookPayload({ eventTypes: ['New recommendation'] });

    // Step 1: Navigate to integrations page
    await page.goto(INTEGRATIONS_PATH);
    await page.waitForLoadState('domcontentloaded');

    // Dual-timeout strategy: fast check (5s) → reload if needed → full retry (30s)
    // Use exact: true to avoid strict mode violation (multiple "Integrations" headings exist)
    const heading = page.getByRole('heading', { name: 'Integrations', exact: true });
    if (!(await heading.isVisible({ timeout: 5000 }))) {
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
    }
    await expect(heading).toBeVisible({ timeout: 30000 });

    await dismissCookieConsent(page);

    // Step 2: Open wizard - click "Create Integration" dropdown
    // Wait for button to be visible and actionable (module federation can be slow to hydrate)
    const createButton = page.getByRole('button', { name: 'Create Integration' }).first();
    await expect(createButton).toBeVisible({ timeout: 30000 });
    await createButton.click();

    const webhooksMenuItem = page
      .getByRole('menuitem', { name: 'Webhooks' })
      .or(page.locator('a:has-text("Webhooks")'));
    await webhooksMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    await webhooksMenuItem.click();

    await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 10000 });

    // Step 3: Fill and submit wizard
    await fillWebhookForm(page, webhookPayload);

    // Wait for wizard to close
    const wizardDialog = page.locator('[role="dialog"][aria-labelledby="add-integration-wizard"]');
    if ((await wizardDialog.count()) > 0) {
      await wizardDialog.waitFor({ state: 'hidden', timeout: 15000 });
    }

    // Wait for backdrop to disappear if present
    const backdrop = page.locator('.pf-v6-c-backdrop__open, .pf-c-backdrop');
    if ((await backdrop.count()) > 0) {
      await backdrop.waitFor({ state: 'detached', timeout: 5000 });
    }

    // Step 4: Navigate to Webhooks tab
    const webhooksTab = page.locator('button:has-text("Webhooks"), a:has-text("Webhooks")').first();
    await webhooksTab.click();
    await page.waitForLoadState('domcontentloaded');

    // Wait for table and scroll into view
    const table = page
      .locator('table, [data-ouia-component-type="PF6/Table"]')
      .or(page.locator('text="No integrations"'))
      .first();
    await table.waitFor({ state: 'visible', timeout: 10000 });
    await table.scrollIntoViewIfNeeded();

    // Step 5: Verify webhook appears in table
    const webhookElement = page.locator(`text="${webhookPayload.name}"`).first();
    await expect(webhookElement).toBeVisible({ timeout: 15000 });

    // Step 6: Delete webhook
    await deleteIntegration(page, webhookPayload.name);

    // Step 7: Verify deletion
    await expect(webhookElement).not.toBeVisible({ timeout: 10000 });
  });
});

// =============================================================================
// Communication Integration Tests
// =============================================================================

const communicationTypes = ['slack', 'teams', 'gchat', 'email'] as const;

test.describe('Communication Integration Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
  });

  for (const type of communicationTypes) {
    test(`should create, verify, and delete ${type} integration`, async ({ page }) => {
      const payload = generateCommunicationPayload(type, {
        eventTypes: ['New recommendation'],
      });

      // Step 1: Navigate to integrations page
      await page.goto(INTEGRATIONS_PATH);
      await page.waitForLoadState('domcontentloaded');

      // Dual-timeout strategy: fast check (5s) → reload if needed → full retry (30s)
      const heading = page.getByRole('heading', { name: 'Integrations', exact: true });
      if (!(await heading.isVisible({ timeout: 5000 }))) {
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
      }
      await expect(heading).toBeVisible({ timeout: 30000 });

      await dismissCookieConsent(page);

      // Step 2: Open wizard - click "Create Integration" dropdown
      const createButton = page.getByRole('button', { name: 'Create Integration' }).first();
      await expect(createButton).toBeVisible({ timeout: 30000 });
      await createButton.click();

      const communicationsMenuItem = page
        .getByRole('menuitem', { name: 'Communications' })
        .or(page.locator('a:has-text("Communications")'));
      await communicationsMenuItem.waitFor({ state: 'visible', timeout: 5000 });
      await communicationsMenuItem.click();

      await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 10000 });

      // Step 3: Fill and submit wizard
      await fillCommunicationForm(page, payload);

      // Wait for wizard to close
      const wizardDialog = page.locator(
        '[role="dialog"][aria-labelledby="add-integration-wizard"]'
      );
      if ((await wizardDialog.count()) > 0) {
        await wizardDialog.waitFor({ state: 'hidden', timeout: 15000 });
      }

      // Wait for backdrop to disappear if present
      const backdrop = page.locator('.pf-v6-c-backdrop__open, .pf-c-backdrop');
      if ((await backdrop.count()) > 0) {
        await backdrop.waitFor({ state: 'detached', timeout: 5000 });
      }

      // Step 4: Navigate to Communications tab
      const communicationsTab = page
        .locator('button:has-text("Communications"), a:has-text("Communications")')
        .first();
      await communicationsTab.click();
      await page.waitForLoadState('domcontentloaded');

      // Wait for table and scroll into view
      const table = page
        .locator('table, [data-ouia-component-type="PF6/Table"]')
        .or(page.locator('text="No integrations"'))
        .first();
      await table.waitFor({ state: 'visible', timeout: 10000 });
      await table.scrollIntoViewIfNeeded();

      // Step 5: Verify integration appears in table
      const integrationElement = page.locator(`text="${payload.name}"`).first();
      await expect(integrationElement).toBeVisible({ timeout: 15000 });

      // Step 6: Delete integration
      await deleteIntegration(page, payload.name);

      // Step 7: Verify deletion
      await expect(integrationElement).not.toBeVisible({ timeout: 10000 });
    });
  }
});
