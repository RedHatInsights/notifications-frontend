import { expect, test } from '@playwright/test';
import { disableCookiePrompt } from './test-utils';
import { drawerHelpers } from './utils/drawer-helpers';
import { TIMEOUTS } from './utils/timeouts';

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
 * - The staging environment MUST have at least 2 notifications present
 */

/** Drawer API paths */
const DRAWER_API = '/api/notifications/v1.0/notifications/drawer';
const DRAWER_READ_API = '/api/notifications/v1.0/notifications/drawer/read';

/** Minimum notifications required by this test suite */
const MIN_NOTIFICATIONS = 2;

/** Notification IDs fetched from the API — shared across tests in this suite */
let notificationIds: string[] = [];

test.describe('Notifications Drawer — Panel Dropdown Menu', () => {
  test.beforeAll(async ({ request }) => {
    // Validate that the test account has enough notifications for deterministic testing
    const response = await request.get(DRAWER_API, { params: { limit: 50 } });
    expect(response.ok(), 'Drawer API must be accessible').toBe(true);

    const { data } = await response.json();
    notificationIds = data.map((entry: { id: string }) => entry.id);

    expect(
      notificationIds.length,
      `Stage test account must have ≥${MIN_NOTIFICATIONS} notifications — seed the account via the event pipeline`
    ).toBeGreaterThanOrEqual(MIN_NOTIFICATIONS);
  });

  test.beforeEach(async ({ page, request }) => {
    // Reset ALL notifications to unread — deterministic baseline for every test
    await request.put(DRAWER_READ_API, {
      data: { notification_ids: notificationIds, read_status: false },
    });

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

    const dropdown = await drawerHelpers.openActionsDropdown(page);

    // Bulk action items — use regex to match count in parentheses
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected \(\d+\) as read/ })
    ).toBeVisible();
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected \(\d+\) as unread/ })
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

    await drawerHelpers.closeActionsDropdown(page);
  });

  // ── 2. Bulk Actions Disabled When Nothing Selected ───────────────

  test('bulk actions are disabled when no notifications are selected', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    // Ensure none selected
    await drawerHelpers.bulkSelectNone(page);

    const dropdown = await drawerHelpers.openActionsDropdown(page);

    // Bulk action items should show count 0 and be disabled
    const markRead = dropdown.getByRole('menuitem', { name: /Mark selected \(\d+\) as read/ });
    const markUnread = dropdown.getByRole('menuitem', { name: /Mark selected \(\d+\) as unread/ });

    await expect(markRead).toHaveAttribute('aria-disabled', 'true');
    await expect(markUnread).toHaveAttribute('aria-disabled', 'true');

    // Verify count is 0 via semantic data attribute
    await expect(markRead).toHaveAttribute('data-selected-count', '0');
    await expect(markUnread).toHaveAttribute('data-selected-count', '0');

    // Navigation items should remain enabled
    const viewLog = dropdown.getByRole('menuitem', { name: 'View event log' });
    await expect(viewLog).not.toHaveAttribute('aria-disabled', 'true');

    await drawerHelpers.closeActionsDropdown(page);
  });

  // ── 3. Bulk Actions Enabled With Selection ───────────────────────

  test('bulk actions become enabled and show correct count when notifications are selected', async ({
    page,
  }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);

    // Start with none selected
    await drawerHelpers.bulkSelectNone(page);

    // Select exactly 2 notifications (precondition ensures at least 2 exist)
    const selectCount = 2;
    for (let i = 0; i < selectCount; i++) {
      await drawerHelpers.selectNotification(items.nth(i));
    }

    const dropdown = await drawerHelpers.openActionsDropdown(page);

    // Bulk action items should show correct count via semantic attribute and be enabled
    const markRead = dropdown.getByRole('menuitem', { name: /Mark selected \(\d+\) as read/ });
    const markUnread = dropdown.getByRole('menuitem', { name: /Mark selected \(\d+\) as unread/ });

    await expect(markRead).toHaveAttribute('data-selected-count', String(selectCount));
    await expect(markUnread).toHaveAttribute('data-selected-count', String(selectCount));

    await expect(markRead).not.toHaveAttribute('aria-disabled', 'true');
    await expect(markUnread).not.toHaveAttribute('aria-disabled', 'true');

    // Close dropdown and clean up selection
    await drawerHelpers.closeActionsDropdown(page);
    await drawerHelpers.bulkSelectNone(page);
  });

  // ── 4. Count Updates Dynamically ─────────────────────────────────

  test('bulk action count updates as selection changes', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    // Start fresh
    await drawerHelpers.bulkSelectNone(page);

    // Select 1 notification
    await drawerHelpers.selectNotification(items.first());

    // Verify count is 1 via semantic attribute
    let dropdown = await drawerHelpers.openActionsDropdown(page);
    const markRead = dropdown.getByRole('menuitem', { name: /Mark selected \(\d+\) as read/ });
    await expect(markRead).toHaveAttribute('data-selected-count', '1');
    await drawerHelpers.closeActionsDropdown(page);

    // Select all
    await drawerHelpers.bulkSelectAll(page);

    // Verify count matches total
    dropdown = await drawerHelpers.openActionsDropdown(page);
    await expect(markRead).toHaveAttribute('data-selected-count', String(count));
    await drawerHelpers.closeActionsDropdown(page);

    // Deselect all
    await drawerHelpers.bulkSelectNone(page);

    // Verify count is 0
    dropdown = await drawerHelpers.openActionsDropdown(page);
    await expect(markRead).toHaveAttribute('data-selected-count', '0');
    await drawerHelpers.closeActionsDropdown(page);
  });

  // ── 5. Mark Selected as Read via Dropdown ────────────────────────

  test('mark selected as read via panel dropdown updates notification state', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);

    // beforeEach resets all notifications to unread — deterministic baseline
    // Select the first notification
    await drawerHelpers.bulkSelectNone(page);
    await drawerHelpers.selectNotification(items.first());

    // Use the panel dropdown to mark as read
    const dropdown = await drawerHelpers.openActionsDropdown(page);
    const markRead = dropdown.getByRole('menuitem', { name: /Mark selected \(\d+\) as read/ });
    await markRead.click();

    // Verify notification is now read
    await expect
      .poll(() => drawerHelpers.isNotificationRead(items.first()), {
        timeout: TIMEOUTS.API_POLL,
      })
      .toBe(true);

    // Verify dropdown closes after action
    await expect(drawerHelpers.actionsDropdown(page)).not.toBeVisible();

    // Re-open dropdown and verify count reset to 0 via semantic attribute
    await drawerHelpers.openActionsDropdown(page);
    await expect(
      drawerHelpers
        .actionsDropdown(page)
        .getByRole('menuitem', { name: /Mark selected \(\d+\) as read/ })
    ).toHaveAttribute('data-selected-count', '0');
    await drawerHelpers.closeActionsDropdown(page);
  });

  // ── 6. Mark Selected as Unread via Dropdown ──────────────────────

  test('mark selected as unread via panel dropdown updates notification state', async ({
    page,
    request,
  }) => {
    // Mark the first notification as read via API — deterministic precondition
    await request.put(DRAWER_READ_API, {
      data: { notification_ids: [notificationIds[0]], read_status: true },
    });

    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);

    // First notification should be read (set via API above)
    await expect
      .poll(() => drawerHelpers.isNotificationRead(items.first()), {
        timeout: TIMEOUTS.API_POLL,
      })
      .toBe(true);

    // Select the first notification
    await drawerHelpers.bulkSelectNone(page);
    await drawerHelpers.selectNotification(items.first());

    // Use the panel dropdown to mark as unread
    const dropdown = await drawerHelpers.openActionsDropdown(page);
    const markUnread = dropdown.getByRole('menuitem', {
      name: /Mark selected \(\d+\) as unread/,
    });
    await markUnread.click();

    // Verify notification is now unread
    await expect
      .poll(() => drawerHelpers.isNotificationRead(items.first()), {
        timeout: TIMEOUTS.API_POLL,
      })
      .toBe(false);

    // Verify dropdown closes after action
    await expect(drawerHelpers.actionsDropdown(page)).not.toBeVisible();
  });

  // ── 7. Navigation Items ──────────────────────────────────────────

  test('view event log navigation item redirects to event log page', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    // Click "View event log" in the actions dropdown
    const dropdown = await drawerHelpers.openActionsDropdown(page);
    const viewLog = dropdown.getByRole('menuitem', { name: 'View event log' });
    await viewLog.click();

    // Verify navigation: URL + page content rendered
    await page.waitForURL(/\/settings\/notifications\/eventlog/, {
      timeout: TIMEOUTS.NAVIGATION,
    });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({
      timeout: TIMEOUTS.NAVIGATION,
    });
  });

  test('manage event notifications item redirects to user preferences', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    // Click "Manage my event notifications" in the actions dropdown
    const dropdown = await drawerHelpers.openActionsDropdown(page);
    const manageNotifs = dropdown.getByRole('menuitem', {
      name: 'Manage my event notifications',
    });
    await manageNotifs.click();

    // Verify navigation: URL + page content rendered
    await page.waitForURL(/\/settings\/notifications\/user-preferences/, {
      timeout: TIMEOUTS.NAVIGATION,
    });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({
      timeout: TIMEOUTS.NAVIGATION,
    });
  });
});
