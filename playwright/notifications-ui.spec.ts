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

  test('should create, edit, and delete behavior group for RHEL', async ({ page }) => {
    /**
     * Test flow:
     * 1. Navigate to Configure Events > Behavior Groups tab
     * 2. Click "Create new group" → fills 4-step wizard (name, actions, event types, review)
     * 3. Verify new behavior group appears in card list
     * 4. Edit behavior group with new name and different action/recipient
     * 5. Verify updated behavior group data appears in card list
     * 6. Delete behavior group via kebab menu with confirmation checkbox
     * 7. Verify behavior group removed from list
     */
    const bundleName = 'rhel';
    const initialGroupName = generateBehaviorGroupName(bundleName);
    const updatedGroupName = `${initialGroupName}-edited`;

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

    // Step 5: Fill and submit wizard with initial data
    await fillBehaviorGroupForm(page, initialGroupName, {
      action: 'Send an email',
      recipient: 'Admins',
      skipEventTypes: true,
    });

    // Step 6: Verify initial behavior group appears
    const initialBgElement = page.locator(`text="${initialGroupName}"`).first();
    await expect(initialBgElement).toBeVisible({ timeout: 10000 });

    // Step 7: Edit behavior group
    const card = page
      .locator('[class*="card"], article', {
        has: page.locator(`text="${initialGroupName}"`),
      })
      .first();

    // Find and click Edit button (could be direct button or in kebab menu)
    const editButton = card.locator('button[aria-label*="Edit"], button:has-text("Edit")').first();

    if ((await editButton.count()) > 0) {
      await editButton.click();
    } else {
      // Try kebab menu
      const kebabButton = card
        .locator('button[aria-label*="Actions"], button[aria-label*="Kebab"]')
        .first();
      await kebabButton.click();
      const editMenuItem = page.locator('button:has-text("Edit")').first();
      await editMenuItem.click();
    }

    // Step 8: Fill edit form with updated data
    await fillBehaviorGroupForm(page, updatedGroupName, {
      action: 'Send an email',
      recipient: 'All',
      skipEventTypes: true,
    });

    // Step 9: Verify updated behavior group appears with new name
    const updatedBgElement = page.locator(`text="${updatedGroupName}"`).first();
    await expect(updatedBgElement).toBeVisible({ timeout: 10000 });

    // Verify old name is gone
    await expect(initialBgElement).not.toBeVisible({ timeout: 5000 });

    // Step 10: Delete behavior group
    const updatedCard = page
      .locator('[class*="card"], article', {
        has: page.locator(`text="${updatedGroupName}"`),
      })
      .first();

    const deleteButton = updatedCard
      .locator('button[aria-label*="Delete"], button:has-text("Delete")')
      .first();

    if ((await deleteButton.count()) > 0) {
      await deleteButton.click();
    } else {
      const kebabButton = updatedCard
        .locator('button[aria-label*="Actions"], button[aria-label*="Kebab"]')
        .first();
      await kebabButton.click();
      const deleteMenuItem = page.locator('button:has-text("Delete")').first();
      await deleteMenuItem.click();
    }

    // Step 11: Confirm deletion
    const acknowledgeCheckbox = page.locator('input[type="checkbox"][id*="acknowledge"]').first();
    await acknowledgeCheckbox.waitFor({ state: 'visible', timeout: 5000 });
    await acknowledgeCheckbox.check();

    const confirmButton = page
      .locator('button:has-text("Delete"), button:has-text("Confirm")')
      .first();
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click();

    // Step 12: Verify deletion
    await expect(updatedBgElement).not.toBeVisible({ timeout: 10000 });
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

    // Verify URL
    await expect(page).toHaveURL(/settings\/notifications\/eventlog/);

    // Verify page header (level might vary, or use getByText for heading)
    await expect(page.getByRole('heading', { name: 'Event Log' })).toBeVisible({ timeout: 30000 });

    // Verify page subtitle
    await expect(
      page.getByText('View all events that have occurred in your organization.')
    ).toBeVisible({ timeout: 30000 });

    // Verify the EventLog table or toolbar is present (indicates page loaded correctly)
    // The table may be empty, but the structure should exist
    const tableOrEmptyState = page
      .locator('[role="grid"], table, [data-ouia-component-type*="Table"]')
      .or(page.getByText(/No events found|No results found/i));
    await expect(tableOrEmptyState.first()).toBeVisible({ timeout: 30000 });
  });
});
