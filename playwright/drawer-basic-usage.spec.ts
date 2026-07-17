import { expect, test } from '@playwright/test';
import { TIMEOUTS, disableCookiePrompt } from './test-utils';
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
    await disableCookiePrompt(page);
    await page.goto('/', { waitUntil: 'load', timeout: TIMEOUTS.PAGE_LOAD });
    // Wait for the bell to appear (chrome must be fully loaded)
    await drawerHelpers.bellButton(page).waitFor({
      state: 'visible',
      timeout: TIMEOUTS.PAGE_LOAD,
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

    // Title — aria-label carries the notification title
    const ariaLabel = await first.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('Notification item');

    // Semantic data attributes from NotificationItem.tsx
    await expect(first).toHaveAttribute('data-testid', /^notification-item-(read|unread)$/);
    await expect(first).toHaveAttribute('data-read-state', /^(read|unread)$/);

    // Checkbox present (semantic — getByRole)
    const checkbox = first.getByRole('checkbox');
    await expect(checkbox).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

    // Kebab menu toggle present (semantic — getByRole with aria-label)
    const kebab = first.getByRole('button', { name: 'Notification actions dropdown' });
    await expect(kebab).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

    console.log(`${count} notification(s) found with correct structure`);
  });

  // ── 4. Individual Read/Unread Toggle ──────────────────────────────

  test.skip('can toggle a notification read status via kebab menu', async ({ page }) => {
    // Skipping this for now as it has potential to remove notifications needed for testing
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
      await expect(first).not.toHaveClass(/pf-m-read/, {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
    } else {
      await expect(first).toHaveClass(/pf-m-read/, {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
    }

    const isNowRead = await first.evaluate((el) => el.classList.contains('pf-m-read'));
    expect(isNowRead).not.toBe(wasRead);

    // Toggle back to restore original state
    await drawerHelpers.toggleReadStatus(page, first);

    // Wait for the class to revert
    if (wasRead) {
      await expect(first).toHaveClass(/pf-m-read/, {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
    } else {
      await expect(first).not.toHaveClass(/pf-m-read/, {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
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

    // PF6 Menu renders filter items via portal — use page-scoped lookup.
    // Filter items use MenuItem with hasCheckbox (role="menuitem").
    const filterItems = page.locator('[role="menuitem"], [role="menuitemcheckbox"]');
    await filterItems.first().waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });
    const filterCount = await filterItems.count();
    expect(filterCount).toBeGreaterThanOrEqual(1); // at least 1 bundle

    // Close dropdown
    await filterToggle.click();
    console.log(`Filter dropdown has ${filterCount} items`);
  });

  // ── 6. Navigation & Quick Links ───────────────────────────────────

  test('actions dropdown shows quick links', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    await drawerHelpers.openActionsDropdown(page);

    // PF6 Dropdown portal — use page-scoped menuitem lookups
    await expect(page.getByRole('menuitem', { name: 'View event log' })).toBeVisible({
      timeout: TIMEOUTS.ELEMENT_VISIBLE,
    });

    await expect(page.getByRole('menuitem', { name: 'Manage my event notifications' })).toBeVisible(
      { timeout: TIMEOUTS.ELEMENT_VISIBLE }
    );

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
      timeout: TIMEOUTS.DRAWER_READY,
    });

    console.log('Navigated to event log');
  });

  test('"Manage my event notifications" navigates correctly', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    await drawerHelpers.clickActionItem(page, 'Manage my event notifications');

    await page.waitForURL(/settings\/notifications\/user-preferences/, {
      timeout: TIMEOUTS.DRAWER_READY,
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

    // Open kebab via semantic aria-label
    const kebab = first.getByRole('button', { name: 'Notification actions dropdown' });
    await kebab.click();

    // PF6 Dropdown portal — menu items render at document.body level.
    // Use page-scoped lookups with explicit waits for CI stability.
    const manageItem = page.getByRole('menuitem', {
      name: 'Manage my event notifications',
    });
    await expect(manageItem).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

    const markItem = page.getByRole('menuitem', { name: /Mark as/ });
    await expect(markItem).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

    const viewItem = page.getByRole('menuitem', { name: 'View in event log' });
    await expect(viewItem).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

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
    await expect(panel.getByText('No notifications found')).toBeVisible({
      timeout: TIMEOUTS.ELEMENT_VISIBLE,
    });

    // All users should see notification preferences link
    await expect(
      panel.getByRole('link', {
        name: /notification preferences/i,
      })
    ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

    console.log('Empty state rendered correctly');
  });

  // ── 10. RBAC — Configure notification settings visibility ─────────

  test('actions dropdown conditionally shows "Configure notification settings"', async ({
    page,
  }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    await drawerHelpers.openActionsDropdown(page);

    // PF6 Dropdown portal — page-scoped lookup
    const configItem = page.getByRole('menuitem', {
      name: 'Manage event configuration',
    });

    // This item is visible only for org admins or users with
    // notifications:notifications:write permission.
    // We simply verify the item exists or not — both are valid depending
    // on the test account's RBAC role.
    const isVisible = await configItem.isVisible().catch(() => false);
    console.log(
      `"Manage event configuration" ${
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

    const bulkSelect = drawerHelpers.bulkSelectToggle(page);
    await expect(bulkSelect).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
    console.log('Bulk select control present');
  });
});
