import { expect, test } from '@playwright/test';
import { NOTIFICATIONS_PATH, ensureLoggedIn } from './test-utils';
import { TIMEOUTS } from './test-constants';
import { generateBehaviorGroupName } from './utils/data-generators';
import { clickCardAction, fillBehaviorGroupForm } from './utils/form-helpers';

/**
 * Notifications UI E2E Test Suite
 *
 * Tests sidebar navigation, behavior group lifecycle, and event log display.
 * Sidebar nav tests verify Chrome renders the correct nav items from frontend.yaml.
 *
 * Uses page.goto() for navigation — CI's Caddy proxy routes /apps/notifications*
 * to the local dev server for JS bundles, while page-level routes fall through
 * to stage for the Chrome shell. Module federation loads the PR's code.
 */

const EXPECTED_NAV_ITEMS = [
  { title: 'Overview', path: `${NOTIFICATIONS_PATH}` },
  { title: 'Configure Events', path: `${NOTIFICATIONS_PATH}/configure-events` },
  { title: 'Event Log', path: `${NOTIFICATIONS_PATH}/eventlog` },
  { title: 'Notification Preferences', path: `${NOTIFICATIONS_PATH}/user-preferences` },
];

// =============================================================================
// Sidebar Navigation Tests
// =============================================================================

test.describe('Notifications Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
  });

  test('sidebar shows all expected nav items', async ({ page }) => {
    await page.goto(NOTIFICATIONS_PATH);
    await page.waitForLoadState('domcontentloaded');

    for (const { title } of EXPECTED_NAV_ITEMS) {
      const navItem = page.locator(`nav [data-ouia-component-id="${title}"]`);
      await expect(navItem, `Nav item "${title}" should be visible`).toBeVisible({
        timeout: TIMEOUTS.PAGE_LOAD,
      });
    }
  });

  test('nav items appear in the correct order', async ({ page }) => {
    await page.goto(NOTIFICATIONS_PATH);
    await page.waitForLoadState('domcontentloaded');

    const navLinks = page.locator('nav [data-ouia-component-id]');
    const titles: string[] = [];

    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      const ouiaId = await navLinks.nth(i).getAttribute('data-ouia-component-id');
      if (ouiaId && EXPECTED_NAV_ITEMS.some((item) => item.title === ouiaId)) {
        titles.push(ouiaId);
      }
    }

    expect(titles).toEqual(EXPECTED_NAV_ITEMS.map((item) => item.title));
  });

  test('each nav item navigates to the correct URL', async ({ page }) => {
    await page.goto(NOTIFICATIONS_PATH);
    await page.waitForLoadState('domcontentloaded');

    for (const { title, path } of EXPECTED_NAV_ITEMS) {
      const navLink = page.locator(`nav [data-ouia-component-id="${title}"]`);
      await expect(navLink).toBeVisible({ timeout: TIMEOUTS.PAGE_LOAD });
      await navLink.click();
      await expect(page).toHaveURL(new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  test('direct navigation highlights the correct nav item', async ({ page }) => {
    for (const { title, path } of EXPECTED_NAV_ITEMS) {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      const navLink = page.locator(`nav [data-ouia-component-id="${title}"] a`);
      await expect(
        navLink,
        `"${title}" should be active after navigating to ${path}`
      ).toHaveAttribute('aria-current', 'page', { timeout: TIMEOUTS.PAGE_LOAD });
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

    await page.goto(`${NOTIFICATIONS_PATH}/configure-events`);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { name: 'Configure Events' })).toBeVisible({
      timeout: TIMEOUTS.PAGE_LOAD,
    });

    // Step 3: Navigate to Behavior Groups tab
    const behaviorGroupsTab = page
      .locator(
        'button:has-text("Behavior Groups"), a:has-text("Behavior Groups"), [role="tab"]:has-text("Behavior Groups")'
      )
      .first();
    await behaviorGroupsTab.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_APPEAR });
    await behaviorGroupsTab.click();
    await page.waitForLoadState('domcontentloaded');

    // Step 4: Open creation wizard
    const createButton = page.getByText('Create new group', { exact: true }).first();
    await createButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_APPEAR });
    await createButton.click();

    // Step 5: Fill and submit wizard with initial data
    await fillBehaviorGroupForm(page, initialGroupName, {
      action: 'Send an email',
      recipient: 'Admins',
      skipEventTypes: true,
    });

    // Step 6: Verify initial behavior group appears
    const initialBgElement = page.locator(`text="${initialGroupName}"`).first();
    await expect(initialBgElement).toBeVisible({ timeout: TIMEOUTS.ELEMENT_APPEAR });

    // Step 7: Edit behavior group
    const card = page
      .locator('[class*="card"], article', {
        has: page.locator(`text="${initialGroupName}"`),
      })
      .first();

    // Use shared helper to click Edit action
    await clickCardAction(card, page, 'Edit');

    // Step 8: Fill edit form with updated data
    await fillBehaviorGroupForm(page, updatedGroupName, {
      action: 'Send an email',
      recipient: 'All',
      skipEventTypes: true,
    });

    // Step 9: Verify updated behavior group appears with new name
    const updatedBgElement = page.locator(`text="${updatedGroupName}"`).first();
    await expect(updatedBgElement).toBeVisible({ timeout: TIMEOUTS.ELEMENT_APPEAR });

    // Verify old name is gone (use consistent timeout with other edit-submission checks)
    await expect(initialBgElement).not.toBeVisible({ timeout: TIMEOUTS.ELEMENT_APPEAR });

    // Step 10: Delete behavior group
    const updatedCard = page
      .locator('[class*="card"], article', {
        has: page.locator(`text="${updatedGroupName}"`),
      })
      .first();

    // Use shared helper to click Delete action
    await clickCardAction(updatedCard, page, 'Delete');

    // Step 11: Confirm deletion
    const acknowledgeCheckbox = page.locator('input[type="checkbox"][id*="acknowledge"]').first();
    await acknowledgeCheckbox.waitFor({ state: 'visible', timeout: TIMEOUTS.QUICK_CHECK });
    await acknowledgeCheckbox.check();

    const confirmButton = page
      .locator('button:has-text("Delete"), button:has-text("Confirm")')
      .first();
    await confirmButton.waitFor({ state: 'visible', timeout: TIMEOUTS.QUICK_CHECK });
    await confirmButton.click();

    // Step 12: Verify deletion
    await expect(updatedBgElement).not.toBeVisible({ timeout: TIMEOUTS.ELEMENT_APPEAR });
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
    await page.goto(`${NOTIFICATIONS_PATH}/eventlog`);
    await page.waitForLoadState('domcontentloaded');

    // Verify URL
    await expect(page).toHaveURL(/settings\/notifications\/eventlog/);

    // Verify page header
    await expect(page.getByRole('heading', { name: 'Event Log' })).toBeVisible({
      timeout: TIMEOUTS.PAGE_LOAD,
    });

    // Verify page subtitle
    await expect(
      page.getByText('View all events that have occurred in your organization.')
    ).toBeVisible({ timeout: TIMEOUTS.PAGE_LOAD });

    // Verify the EventLog table or toolbar is present (indicates page loaded correctly)
    // The table may be empty, but the structure should exist
    const tableOrEmptyState = page
      .locator('[role="grid"], table, [data-ouia-component-type*="Table"]')
      .or(page.getByText(/No events found|No results found/i));
    await expect(tableOrEmptyState.first()).toBeVisible({ timeout: TIMEOUTS.PAGE_LOAD });
  });
});
