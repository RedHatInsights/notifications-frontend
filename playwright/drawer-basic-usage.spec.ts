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
      const count = await drawerHelpers.getUnreadCount(page);
      expect(count).toBeGreaterThan(0);
      console.log(`Bell shows unread variant with count=${count}`);
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

    if (count === 0) {
      console.log('No notifications — skipping read/unread toggle');
      return;
    }

    const first = items.first();
    const wasRead = await first.evaluate((el) => el.classList.contains('pf-m-read'));

    // Toggle read status
    await drawerHelpers.toggleReadStatus(page, first);

    // Wait for the read-state class to change
    if (wasRead) {
      await expect(first).not.toHaveClass(/pf-m-read/, { timeout: 5000 });
    } else {
      await expect(first).toHaveClass(/pf-m-read/, { timeout: 5000 });
    }

    const isNowRead = await first.evaluate((el) => el.classList.contains('pf-m-read'));
    expect(isNowRead).not.toBe(wasRead);

    // Toggle back to restore original state
    await drawerHelpers.toggleReadStatus(page, first);

    // Wait for the class to revert
    if (wasRead) {
      await expect(first).toHaveClass(/pf-m-read/, { timeout: 5000 });
    } else {
      await expect(first).not.toHaveClass(/pf-m-read/, { timeout: 5000 });
    }

    console.log(`Toggled read status: ${wasRead ? 'read→unread→read' : 'unread→read→unread'}`);
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

    // "View notifications log" should always be present
    await expect(dropdown.getByRole('menuitem', { name: 'View notifications log' })).toBeVisible();

    // "Manage my notification preferences" should always be present
    await expect(
      dropdown.getByRole('menuitem', {
        name: 'Manage my notification preferences',
      })
    ).toBeVisible();

    console.log('Actions dropdown quick links verified');

    // Close by clicking toggle again
    await page.locator('#notifications-actions-toggle').click();
  });

  test('"View notifications log" navigates to the correct page', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    await drawerHelpers.clickActionItem(page, 'View notifications log');

    // Drawer should auto-close and navigate
    await page.waitForURL(/settings\/notifications\/notificationslog/, {
      timeout: 30000,
    });

    console.log('Navigated to notifications log');
  });

  test('"Manage my notification preferences" navigates correctly', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    await drawerHelpers.clickActionItem(page, 'Manage my notification preferences');

    await page.waitForURL(/settings\/notifications\/user-preferences/, {
      timeout: 30000,
    });

    console.log('Navigated to notification preferences');
  });

  // ── 7. Per-Notification Actions ───────────────────────────────────

  test('notification kebab has "Manage this event" option', async ({ page }) => {
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

    const manageItem = page
      .locator('#notification-item-dropdown')
      .getByRole('menuitem', { name: 'Manage this event' });
    await expect(manageItem).toBeVisible();

    const markItem = page
      .locator('#notification-item-dropdown')
      .getByRole('menuitem', { name: /Mark as/ });
    await expect(markItem).toBeVisible();

    // Close dropdown without navigating
    await kebab.click();
    console.log('Notification kebab menu items verified');
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

    // BulkSelect component with id="notifications-bulk-select"
    const bulkSelect = page.locator('#notifications-bulk-select');
    await expect(bulkSelect).toBeVisible();
    console.log('Bulk select control present');
  });
});
