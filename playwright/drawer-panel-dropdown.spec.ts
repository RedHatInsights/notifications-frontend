import { expect, test } from '@playwright/test';
import { disableCookiePrompt } from '@redhat-cloud-services/playwright-test-auth';
import { drawerHelpers } from './utils/drawer-helpers';

/**
 * E2E tests for the notifications drawer — panel-level actions dropdown menu.
 *
 * RHCLOUD-48124
 * Covers: actions dropdown structure, bulk action disabled/enabled states,
 * dynamic selected-count labels, divider between action groups, navigation
 * items, and mark-as-read/unread via the panel dropdown.
 *
 * Prerequisites:
 * - Authentication is handled by globalSetup (session reused via storageState)
 * - The staging environment MUST have notifications present for full coverage
 */

/** Symbolic timeout constants — eliminates magic numbers */
const TIMEOUTS = {
  /** Chrome shell + federated module initial load */
  CHROME_LOAD: 60_000,
  /** Dropdown/popover/menu visibility transitions */
  DROPDOWN: 5_000,
  /** API response polling (mark read/unread state changes) */
  API_POLL: 10_000,
  /** SPA client-side page navigation */
  NAVIGATION: 30_000,
} as const;

test.describe('Notifications Drawer — Panel Dropdown Menu', () => {
  test.beforeEach(async ({ page }) => {
    await disableCookiePrompt(page);
    await page.goto('/');
    await drawerHelpers.bellButton(page).waitFor({
      state: 'visible',
      timeout: TIMEOUTS.CHROME_LOAD,
    });
  });

  // ── 1. Dropdown Structure ────────────────────────────────────────

  test('actions dropdown shows all expected menu items', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const actionsToggle = page.locator('#notifications-actions-toggle');
    await actionsToggle.click();

    const dropdown = page.locator('#notifications-actions-dropdown');
    await expect(dropdown).toBeVisible({ timeout: TIMEOUTS.DROPDOWN });

    // Bulk action items
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected .* as read/ })
    ).toBeVisible();
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected .* as unread/ })
    ).toBeVisible();

    // Navigation items
    await expect(dropdown.getByRole('menuitem', { name: 'View event log' })).toBeVisible();
    await expect(
      dropdown.getByRole('menuitem', { name: 'Manage my event notifications' })
    ).toBeVisible();

    // "Manage event configuration" may be disabled for non-admins but should exist
    await expect(
      dropdown.getByRole('menuitem', { name: 'Manage event configuration' })
    ).toBeVisible();

    // Divider between bulk actions and navigation items
    const separators = dropdown.getByRole('separator');
    await expect(separators.first()).toBeVisible();

    // Close dropdown
    await actionsToggle.click();
  });

  // ── 2. Bulk Actions Disabled When Nothing Selected ───────────────

  test('bulk actions are disabled when no notifications are selected', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    expect(
      count,
      'Staging environment must have notifications — verify event pipeline is operational'
    ).toBeGreaterThan(0);

    // Ensure none selected
    await drawerHelpers.bulkSelectNone(page);

    // Open actions dropdown
    const actionsToggle = page.locator('#notifications-actions-toggle');
    await actionsToggle.click();

    const dropdown = page.locator('#notifications-actions-dropdown');
    await expect(dropdown).toBeVisible({ timeout: TIMEOUTS.DROPDOWN });

    // Bulk action items should show count 0 and be disabled
    const markRead = dropdown.getByRole('menuitem', { name: /Mark selected .* as read/ });
    const markUnread = dropdown.getByRole('menuitem', { name: /Mark selected .* as unread/ });

    await expect(markRead).toHaveAttribute('aria-disabled', 'true');
    await expect(markUnread).toHaveAttribute('aria-disabled', 'true');

    // Verify count is 0 in labels
    await expect(markRead).toContainText('(0)');
    await expect(markUnread).toContainText('(0)');

    // Navigation items should remain enabled
    const viewLog = dropdown.getByRole('menuitem', { name: 'View event log' });
    await expect(viewLog).not.toHaveAttribute('aria-disabled', 'true');

    // Close dropdown
    await actionsToggle.click();
  });

  // ── 3. Bulk Actions Enabled With Selection ───────────────────────

  test('bulk actions become enabled and show correct count when notifications are selected', async ({
    page,
  }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    expect(
      count,
      'Staging environment must have notifications — verify event pipeline is operational'
    ).toBeGreaterThan(0);

    // Start with none selected
    await drawerHelpers.bulkSelectNone(page);

    // Select first two notifications (or just one if only one available)
    const selectCount = Math.min(count, 2);
    for (let i = 0; i < selectCount; i++) {
      await drawerHelpers.selectNotification(items.nth(i));
    }

    // Open actions dropdown
    const actionsToggle = page.locator('#notifications-actions-toggle');
    await actionsToggle.click();

    const dropdown = page.locator('#notifications-actions-dropdown');
    await expect(dropdown).toBeVisible({ timeout: TIMEOUTS.DROPDOWN });

    // Bulk action items should show correct count and be enabled
    const markRead = dropdown.getByRole('menuitem', { name: /Mark selected .* as read/ });
    const markUnread = dropdown.getByRole('menuitem', { name: /Mark selected .* as unread/ });

    await expect(markRead).toContainText(`(${selectCount})`);
    await expect(markUnread).toContainText(`(${selectCount})`);

    await expect(markRead).not.toHaveAttribute('aria-disabled', 'true');
    await expect(markUnread).not.toHaveAttribute('aria-disabled', 'true');

    // Close dropdown and clean up selection
    await actionsToggle.click();
    await drawerHelpers.bulkSelectNone(page);
  });

  // ── 4. Count Updates Dynamically ─────────────────────────────────

  test('bulk action count updates as selection changes', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    expect(
      count,
      'Staging environment must have at least 2 notifications for selection-change test'
    ).toBeGreaterThanOrEqual(2);

    // Start fresh
    await drawerHelpers.bulkSelectNone(page);

    // Select 1 notification
    await drawerHelpers.selectNotification(items.first());

    // Verify count is 1
    const actionsToggle = page.locator('#notifications-actions-toggle');
    await actionsToggle.click();
    const dropdown = page.locator('#notifications-actions-dropdown');
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected .* as read/ })
    ).toContainText('(1)');
    await actionsToggle.click();

    // Select all
    await drawerHelpers.bulkSelectAll(page);

    // Verify count matches total
    await actionsToggle.click();
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected .* as read/ })
    ).toContainText(`(${count})`);
    await actionsToggle.click();

    // Deselect all
    await drawerHelpers.bulkSelectNone(page);

    // Verify count is 0
    await actionsToggle.click();
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected .* as read/ })
    ).toContainText('(0)');
    await actionsToggle.click();
  });

  // ── 5. Mark Selected as Read via Dropdown ────────────────────────

  test('mark selected as read via panel dropdown updates notification state', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    expect(
      count,
      'Staging environment must have notifications — verify event pipeline is operational'
    ).toBeGreaterThan(0);

    // Get initial read/unread counts
    const initialCounts = await drawerHelpers.getReadUnreadCounts(page);

    // Ensure some are unread — if all read, mark all as unread first
    if (initialCounts.unread === 0) {
      await drawerHelpers.bulkSelectAll(page);
      await drawerHelpers.markSelectedAsUnread(page);
      await expect
        .poll(() => drawerHelpers.getReadUnreadCounts(page).then((c) => c.unread), {
          timeout: TIMEOUTS.API_POLL,
        })
        .toBeGreaterThan(0);
    }

    // Select the first notification
    await drawerHelpers.bulkSelectNone(page);
    await drawerHelpers.selectNotification(items.first());

    // Use the panel dropdown to mark as read
    const actionsToggle = page.locator('#notifications-actions-toggle');
    await actionsToggle.click();
    const dropdown = page.locator('#notifications-actions-dropdown');
    const markRead = dropdown.getByRole('menuitem', { name: /Mark selected .* as read/ });
    await markRead.click();

    // Verify notification is now read
    await expect
      .poll(() => drawerHelpers.isNotificationRead(items.first()), {
        timeout: TIMEOUTS.API_POLL,
      })
      .toBe(true);

    // Verify dropdown closes after action
    await expect(dropdown).not.toBeVisible({ timeout: TIMEOUTS.DROPDOWN });

    // Re-open dropdown and verify count reset to 0
    await actionsToggle.click();
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected .* as read/ })
    ).toContainText('(0)');
    await actionsToggle.click();
  });

  // ── 6. Mark Selected as Unread via Dropdown ──────────────────────

  test('mark selected as unread via panel dropdown updates notification state', async ({
    page,
  }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    expect(
      count,
      'Staging environment must have notifications — verify event pipeline is operational'
    ).toBeGreaterThan(0);

    // Ensure first notification is read
    const isRead = await drawerHelpers.isNotificationRead(items.first());
    if (!isRead) {
      await drawerHelpers.bulkSelectNone(page);
      await drawerHelpers.selectNotification(items.first());
      await drawerHelpers.markSelectedAsRead(page);
      await expect
        .poll(() => drawerHelpers.isNotificationRead(items.first()), {
          timeout: TIMEOUTS.API_POLL,
        })
        .toBe(true);
    }

    // Select the first notification
    await drawerHelpers.bulkSelectNone(page);
    await drawerHelpers.selectNotification(items.first());

    // Use the panel dropdown to mark as unread
    const actionsToggle = page.locator('#notifications-actions-toggle');
    await actionsToggle.click();
    const dropdown = page.locator('#notifications-actions-dropdown');
    const markUnread = dropdown.getByRole('menuitem', { name: /Mark selected .* as unread/ });
    await markUnread.click();

    // Verify notification is now unread
    await expect
      .poll(() => drawerHelpers.isNotificationRead(items.first()), {
        timeout: TIMEOUTS.API_POLL,
      })
      .toBe(false);

    // Verify dropdown closes after action
    await expect(dropdown).not.toBeVisible({ timeout: TIMEOUTS.DROPDOWN });
  });

  // ── 7. Navigation Items ──────────────────────────────────────────

  test('view event log navigation item redirects to event log page', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    // Click "View event log" in the actions dropdown
    const actionsToggle = page.locator('#notifications-actions-toggle');
    await actionsToggle.click();
    const dropdown = page.locator('#notifications-actions-dropdown');
    const viewLog = dropdown.getByRole('menuitem', { name: 'View event log' });
    await viewLog.click();

    // Should navigate to the event log page
    await page.waitForURL(/\/settings\/notifications\/eventlog/, {
      timeout: TIMEOUTS.NAVIGATION,
    });
  });

  test('manage event notifications item redirects to user preferences', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    // Click "Manage my event notifications" in the actions dropdown
    const actionsToggle = page.locator('#notifications-actions-toggle');
    await actionsToggle.click();
    const dropdown = page.locator('#notifications-actions-dropdown');
    const manageNotifs = dropdown.getByRole('menuitem', {
      name: 'Manage my event notifications',
    });
    await manageNotifs.click();

    // Should navigate to user preferences page
    await page.waitForURL(/\/settings\/notifications\/user-preferences/, {
      timeout: TIMEOUTS.NAVIGATION,
    });
  });
});
