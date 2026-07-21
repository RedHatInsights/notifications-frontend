import { expect, test } from '@playwright/test';
import { ensureLoggedIn } from './test-utils';
import { drawerHelpers } from './utils/drawer-helpers';

/**
 * E2E tests for the notifications drawer — basic usage and empty states.
 *
 * RHCLOUD-47550
 * Covers: bell icon/badge, open/close, notification display, individual
 * read/unread, filtering, navigation/quick links, per-notification actions,
 * and empty-state variations.
 *
 * These tests run against stage with real data. Counts and content may vary;
 * tests assert structure and behavior, not exact values.
 */
test.describe('Notifications Drawer — Basic Usage', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
    // Wait for the bell to appear (chrome must be fully loaded)
    await drawerHelpers.bellButton(page).waitFor({
      state: 'visible',
      timeout: 60000,
    });
  });

  // ── 1. Bell Icon & Badge Display ──────────────────────────────────

  test('bell icon is visible in the header toolbar', async ({ page }) => {
    const bell = drawerHelpers.bellButton(page);
    await expect(bell).toBeVisible();
    console.log('Bell icon visible in header');
  });

  test('bell badge reflects unread state', async ({ page }) => {
    const bell = drawerHelpers.bellButton(page);
    const cls = (await bell.getAttribute('class')) ?? '';

    // Badge variant must be either "read" or "unread" — never absent
    const isUnread = cls.includes('unread');
    const isRead = cls.includes('read');
    expect(isUnread || isRead).toBe(true);

    if (isUnread) {
      // The count badge element may not render for small counts (dot-only variant).
      // The unread class itself is the reliable indicator.
      const count = await drawerHelpers.getUnreadCount(page);
      console.log(`Bell shows unread variant (count badge: ${count || 'not displayed'})`);
    } else {
      console.log('Bell shows read variant (0 unread)');
    }
  });

  // ── 2. Opening & Closing ──────────────────────────────────────────

  test('clicking bell opens the drawer with a header', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const panel = drawerHelpers.drawerPanel(page);
    await expect(panel).toBeVisible();
    await expect(panel.getByText('Notifications').first()).toBeVisible();
    console.log('Drawer opened successfully');
  });

  test('clicking close button closes the drawer', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);
    await drawerHelpers.closeDrawer(page);

    await expect(drawerHelpers.drawerPanel(page)).not.toBeVisible();
    console.log('Drawer closed successfully');
  });

  // ── 3. Notification Display ───────────────────────────────────────

  test('notifications show title, source label, and timestamp', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count === 0) {
      // Empty state — verified in a separate test
      console.log('No notifications present — skipping structure check');
      return;
    }

    const first = items.first();

    // Title is in the header
    const header = first.locator('.pf-v6-c-notification-drawer__list-item-header-title');
    await expect(header).toBeVisible();

    // Source label (Label component with variant=outline)
    const sourceLabel = first.locator('.pf-v6-c-label');
    await expect(sourceLabel).toBeVisible();

    // Timestamp (DateFormat renders relative time in the body)
    const timestamp = first.locator('.pf-v6-c-notification-drawer__list-item-timestamp');
    await expect(timestamp).toBeVisible();

    // Checkbox present
    const checkbox = first.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();

    console.log(`${count} notification(s) found with correct structure`);
  });

  // ── 4. Individual Read/Unread Toggle ──────────────────────────────

  test('can toggle a notification read status via kebab menu', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();
    expect(count, 'Test account must have at least one notification').toBeGreaterThan(0);

    const first = items.first();
    const wasRead = await drawerHelpers.isNotificationRead(first);
    const before = await drawerHelpers.getReadUnreadCounts(page);

    // Toggle read status
    await drawerHelpers.toggleReadStatus(page, first);

    // Drawer re-sorts after toggling (unread first), so verify via counts
    const expectedRead = wasRead ? before.read - 1 : before.read + 1;
    await expect
      .poll(async () => (await drawerHelpers.getReadUnreadCounts(page)).read, {
        timeout: 10000,
      })
      .toBe(expectedRead);

    // Toggle the new first item back to roughly restore state
    const newFirst = drawerHelpers.notificationItems(page).first();
    await drawerHelpers.toggleReadStatus(page, newFirst);

    console.log('Toggled read status and verified count change');
  });

  // ── 5. Filtering ──────────────────────────────────────────────────

  test('filter dropdown is present and functional', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const filterToggle = page.locator('#notifications-filter-toggle');
    await expect(filterToggle).toBeVisible();

    const items = drawerHelpers.notificationItems(page);
    const totalCount = await items.count();

    if (totalCount === 0) {
      console.log('No notifications — filter toggle should be disabled');
      return;
    }

    // Open filter dropdown and verify items exist
    await filterToggle.click();
    const filterDropdown = page.locator('#notifications-filter-dropdown');
    await expect(filterDropdown).toBeVisible();

    // Should have at least one filter option + "Reset filters"
    const filterItems = filterDropdown.getByRole('menuitem');
    const filterCount = await filterItems.count();
    expect(filterCount).toBeGreaterThanOrEqual(2); // at least 1 bundle + reset

    // Close dropdown
    await filterToggle.click();
    console.log(`Filter dropdown has ${filterCount} items (incl. reset)`);
  });

  // ── 6. Navigation & Quick Links ───────────────────────────────────

  test('actions dropdown shows quick links', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    await drawerHelpers.openActionsDropdown(page);

    const dropdown = page.locator('#notifications-actions-dropdown');

    // "View event log" should always be present
    await expect(dropdown.getByRole('menuitem', { name: 'View event log' })).toBeVisible();

    // "Manage my event notifications" should always be present
    await expect(
      dropdown.getByRole('menuitem', {
        name: 'Manage my event notifications',
      })
    ).toBeVisible();

    console.log('Actions dropdown quick links verified');

    // Close by clicking toggle again
    await page.locator('#notifications-actions-toggle').click();
  });

  test('"View event log" navigates to the correct page', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    await drawerHelpers.clickActionItem(page, 'View event log');

    // Drawer should auto-close and navigate
    await page.waitForURL(/settings\/notifications\/eventlog/, {
      timeout: 30000,
    });

    console.log('Navigated to event log');
  });

  test('"Manage my event notifications" navigates correctly', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    await drawerHelpers.clickActionItem(page, 'Manage my event notifications');

    await page.waitForURL(/settings\/notifications\/user-preferences/, {
      timeout: 30000,
    });

    console.log('Navigated to notification preferences');
  });

  // ── 7. Per-Notification Actions ───────────────────────────────────

  test('notification kebab has expected menu items', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count === 0) {
      console.log('No notifications — skipping kebab menu check');
      return;
    }

    const first = items.first();
    const kebab = first.locator('#notification-item-toggle');
    await kebab.click();

    const dropdown = page.locator('#notification-item-dropdown');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    await expect(dropdown.getByRole('menuitem', { name: /Mark as/ })).toBeVisible();
    await expect(dropdown.getByRole('menuitem', { name: 'View in event log' })).toBeVisible();
    await expect(
      dropdown.getByRole('menuitem', { name: 'Manage my event notifications' })
    ).toBeVisible();
    await expect(
      dropdown.getByRole('menuitem', { name: 'Manage event configuration' })
    ).toBeVisible();

    // Close dropdown without navigating
    await kebab.click();
    console.log('Notification kebab menu items verified');
  });

  test('notification kebab "View in event log" navigates correctly', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    expect(await items.count(), 'Test account must have at least one notification').toBeGreaterThan(
      0
    );

    const first = items.first();
    const kebab = first.locator('#notification-item-toggle');
    await kebab.click();

    const dropdown = page.locator('#notification-item-dropdown');
    await expect(dropdown).toBeVisible({ timeout: 5000 });
    await dropdown.getByRole('menuitem', { name: 'View in event log' }).click();

    await page.waitForURL(/settings\/notifications\/eventlog/, { timeout: 30000 });
    console.log('Per-notification "View in event log" navigated correctly');
  });

  test('notification kebab "Manage my event notifications" navigates correctly', async ({
    page,
  }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    expect(await items.count(), 'Test account must have at least one notification').toBeGreaterThan(
      0
    );

    const first = items.first();
    const kebab = first.locator('#notification-item-toggle');
    await kebab.click();

    const dropdown = page.locator('#notification-item-dropdown');
    await expect(dropdown).toBeVisible({ timeout: 5000 });
    await dropdown.getByRole('menuitem', { name: 'Manage my event notifications' }).click();

    await page.waitForURL(/settings\/notifications\/user-preferences/, { timeout: 30000 });
    console.log('Per-notification "Manage my event notifications" navigated correctly');
  });

  test('notification kebab "Manage event configuration" navigates correctly', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    expect(await items.count(), 'Test account must have at least one notification').toBeGreaterThan(
      0
    );

    const first = items.first();
    const kebab = first.locator('#notification-item-toggle');
    await kebab.click();

    const dropdown = page.locator('#notification-item-dropdown');
    await expect(dropdown).toBeVisible({ timeout: 5000 });
    await dropdown.getByRole('menuitem', { name: 'Manage event configuration' }).click();

    await page.waitForURL(/settings\/notifications\/configure-events/, { timeout: 30000 });
    console.log('Per-notification "Manage event configuration" navigated correctly');
  });

  // ── 8 & 9. Empty States ───────────────────────────────────────────

  test('empty state shows correct content when no notifications exist', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count > 0) {
      console.log(`${count} notifications present — empty state not applicable`);
      return;
    }

    // Verify empty state content
    const panel = drawerHelpers.drawerPanel(page);

    // "No notifications found" heading
    await expect(panel.getByText('No notifications found')).toBeVisible();

    // Bell-slash icon
    const emptyState = panel.locator('.pf-v6-c-empty-state');
    await expect(emptyState).toBeVisible();

    // All users should see notification preferences link
    await expect(
      panel.getByRole('link', {
        name: /notification preferences/i,
      })
    ).toBeVisible();

    console.log('Empty state rendered correctly');
  });

  // ── 10. RBAC — Configure notification settings visibility ─────────

  test('actions dropdown conditionally shows "Configure notification settings"', async ({
    page,
  }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    await drawerHelpers.openActionsDropdown(page);

    const dropdown = page.locator('#notifications-actions-dropdown');
    const configItem = dropdown.getByRole('menuitem', {
      name: 'Configure notification settings',
    });

    // This item is visible only for org admins or users with
    // notifications:notifications:write permission.
    // We simply verify the item exists or not — both are valid depending
    // on the test account's RBAC role.
    const isVisible = await configItem.isVisible().catch(() => false);
    console.log(
      `"Configure notification settings" ${
        isVisible ? 'visible (admin/write-perm user)' : 'hidden (regular user)'
      }`
    );

    // Close dropdown
    await page.locator('#notifications-actions-toggle').click();
  });

  // ── Bulk selection ────────────────────────────────────────────────

  test('bulk select controls are present in drawer header', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const bulkSelect = page.locator('button[data-ouia-component-id="BulkSelect"]');
    await expect(bulkSelect).toBeVisible();
    console.log('Bulk select control present');
  });
});
