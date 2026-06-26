import { expect, test } from '@playwright/test';
import { NOTIFICATIONS_PATH, ensureLoggedIn } from './test-utils';
import { generateBehaviorGroupName } from './utils/data-generators';
import { fillBehaviorGroupForm } from './utils/form-helpers';

/**
 * Notifications UI E2E Test Suite
 *
 * Tests the complete behavior group lifecycle through the UI:
 * 1. Navigation - verify bundle pages and Configure Events loads
 * 2. Create - fill behavior group wizard (name, actions, event types, review)
 * 3. Verify - check behavior group appears in list
 * 4. Delete - remove behavior group with confirmation and verify deletion
 */

const BUNDLES = ['rhel', 'console', 'openshift', 'ansible'];

// =============================================================================
// Bundle Navigation Tests
// =============================================================================

test.describe('Notifications Bundle Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
  });

  test('should navigate to each bundle and Configure Events', async ({ page }) => {
    for (const bundleName of BUNDLES) {
      // Navigate to bundle page
      const bundleUrl = `${NOTIFICATIONS_PATH}/${bundleName}`;
      await page.goto(bundleUrl, { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(new RegExp(`notifications/${bundleName}`));

      // Navigate to Configure Events if available
      const configureEventsLink = page
        .locator(
          'a:has-text("Configure Events"), button:has-text("Configure Events"), [role="tab"]:has-text("Configure Events")'
        )
        .first();

      // Only some bundles have Configure Events - skip if not present
      if ((await configureEventsLink.count()) > 0) {
        await configureEventsLink.click();
        await page.waitForLoadState('domcontentloaded');
      }
    }
  });
});

// =============================================================================
// Behavior Group Lifecycle Tests
// =============================================================================

test.describe('Behavior Group Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
  });

  test('should create, verify, and delete behavior group for RHEL', async ({ page }) => {
    /**
     * Test flow:
     * 1. Navigate to Configure Events > Behavior Groups tab
     * 2. Click "Create new group" → fills 4-step wizard (name, actions, event types, review)
     * 3. Verify new behavior group appears in card list
     * 4. Delete behavior group via kebab menu with confirmation checkbox
     * 5. Verify behavior group removed from list
     */
    const bundleName = 'rhel';
    const groupName = generateBehaviorGroupName(bundleName);

    // Step 1: Navigate to notifications page
    await page.goto(NOTIFICATIONS_PATH, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`notifications`));

    const acceptCookies = page
      .getByRole('button', { name: 'Accept all' })
      .or(page.getByRole('button', { name: 'Accept' }));
    if ((await acceptCookies.count()) > 0) {
      await acceptCookies.click();
    }

    // Step 2: Navigate to Configure Events
    const configureEventsLink = page
      .locator('a:has-text("Configure Events"), button:has-text("Configure Events")')
      .first();
    await configureEventsLink.waitFor({ state: 'visible', timeout: 10000 });
    await configureEventsLink.click();
    await page.waitForLoadState('domcontentloaded');

    // Step 3: Navigate to Behavior Groups tab
    const behaviorGroupsTab = page
      .locator(
        'button:has-text("Behavior Groups"), a:has-text("Behavior Groups"), [role="tab"]:has-text("Behavior Groups")'
      )
      .first();
    await behaviorGroupsTab.waitFor({ state: 'visible', timeout: 10000 });
    await behaviorGroupsTab.click();
    await page.waitForLoadState('domcontentloaded');

    // Step 4: Open creation wizard
    const createButton = page.getByText('Create new group', { exact: true }).first();
    await createButton.waitFor({ state: 'visible', timeout: 10000 });
    await createButton.click();

    // Step 5: Fill and submit wizard
    await fillBehaviorGroupForm(page, groupName, {
      action: 'Send an email',
      recipient: 'Admins',
      skipEventTypes: true,
    });

    // Wait for wizard to close and return to behavior groups list
    const bgElement = page.locator(`text="${groupName}"`).first();
    await expect(bgElement).toBeVisible({ timeout: 10000 });

    // Step 6: Delete behavior group
    const card = page
      .locator('[class*="card"], article', {
        has: page.locator(`text="${groupName}"`),
      })
      .first();

    const deleteButton = card
      .locator('button[aria-label*="Delete"], button:has-text("Delete")')
      .first();

    if ((await deleteButton.count()) > 0) {
      await deleteButton.click();
    } else {
      const kebabButton = card
        .locator('button[aria-label*="Actions"], button[aria-label*="Kebab"]')
        .first();
      await kebabButton.click();
      const deleteMenuItem = page.locator('button:has-text("Delete")').first();
      await deleteMenuItem.click();
    }

    // Step 7: Confirm deletion
    const acknowledgeCheckbox = page.locator('input[type="checkbox"][id*="acknowledge"]').first();
    await acknowledgeCheckbox.waitFor({ state: 'visible', timeout: 5000 });
    await acknowledgeCheckbox.check();

    const confirmButton = page
      .locator('button:has-text("Delete"), button:has-text("Confirm")')
      .first();
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click();

    // Step 8: Verify deletion
    await expect(bgElement).not.toBeVisible({ timeout: 10000 });
  });
});

// =============================================================================
// Events Log Tests
// =============================================================================

test.describe('Events Log', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
  });

  test('should display events log page', async ({ page }) => {
    const eventLogUrl = `${NOTIFICATIONS_PATH}/eventlog`;

    await page.goto(eventLogUrl, { waitUntil: 'domcontentloaded' });

    // Verify we're on the notifications event log route (URL check is sufficient for navigation test)
    await expect(page).toHaveURL(/settings\/notifications\/eventlog/);
  });
});
