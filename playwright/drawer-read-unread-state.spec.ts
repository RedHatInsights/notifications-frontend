import { expect, test } from '@playwright/test';
import { ensureLoggedIn } from './test-utils';
import { drawerHelpers } from './utils/drawer-helpers';

/**
 * E2E tests for notification item read/unread visual state changes.
 *
 * RHCLOUD-48122
 * Covers:
 *   - Bell icon stays purple (pf-m-info class) in both read and unread states
 *   - Read styling (pf-m-read class) applied/removed correctly
 *   - Kebab menu text toggles between "Mark as read" and "Mark as unread"
 *   - Visual state updates immediately after toggle
 *   - Read/unread counts update after toggling
 *
 * Tests run against stage with real data. Counts/content may vary;
 * assertions target structure and behavior, not exact values.
 */
test.describe('Notification Item — Read/Unread Visual Changes', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
    await drawerHelpers.bellButton(page).waitFor({
      state: 'visible',
      timeout: 60000,
    });
  });

  // ── 1. Purple icon preserved across states ─────────────────────────

  test('notification items have pf-m-info class regardless of read state', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    test.skip(count === 0, 'No notifications available');

    // Check up to 5 items — all should have pf-m-info (purple bell icon)
    const checkCount = Math.min(count, 5);
    for (let i = 0; i < checkCount; i++) {
      await expect(items.nth(i)).toHaveClass(/pf-m-info/);
    }

    console.log(`Verified pf-m-info on ${checkCount} notification(s)`);
  });

  // ── 2. Read vs unread CSS classes ──────────────────────────────────

  test('read notification has pf-m-read class, unread does not', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    test.skip(count === 0, 'No notifications available');

    const { read, unread } = await drawerHelpers.getReadUnreadCounts(page);

    if (read > 0) {
      for (let i = 0; i < count; i++) {
        const item = items.nth(i);
        if (await drawerHelpers.isNotificationRead(item)) {
          await expect(item).toHaveClass(/pf-m-read/);
          console.log(`Item ${i} confirmed read (pf-m-read present)`);
          break;
        }
      }
    }

    if (unread > 0) {
      for (let i = 0; i < count; i++) {
        const item = items.nth(i);
        if (!(await drawerHelpers.isNotificationRead(item))) {
          await expect(item).not.toHaveClass(/pf-m-read/);
          console.log(`Item ${i} confirmed unread (no pf-m-read)`);
          break;
        }
      }
    }

    console.log(`Read/unread distribution: ${read} read, ${unread} unread`);
  });

  // ── 3. Kebab menu text matches read state ──────────────────────────

  test('kebab menu shows correct toggle text based on read state', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    test.skip(count === 0, 'No notifications available');

    const first = items.first();
    const wasRead = await drawerHelpers.isNotificationRead(first);

    // Open kebab
    const kebab = first.locator('#notification-item-toggle');
    await kebab.click();
    const dropdown = page.locator('#notification-item-dropdown');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    // Verify correct menu text
    const expectedText = wasRead ? 'Mark as unread' : 'Mark as read';
    await expect(dropdown.getByRole('menuitem', { name: expectedText })).toBeVisible();

    // Close kebab
    await kebab.click();

    console.log(`Kebab correctly shows "${expectedText}"`);
  });

  // ── 4. Toggle preserves pf-m-info, updates pf-m-read + kebab ──────

  test('toggling read state preserves pf-m-info and updates pf-m-read', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    test.skip(count === 0, 'No notifications available');

    const first = items.first();
    const wasRead = await drawerHelpers.isNotificationRead(first);

    // Verify initial state has pf-m-info
    await expect(first).toHaveClass(/pf-m-info/);

    // Toggle read status via kebab
    await drawerHelpers.toggleReadStatus(page, first);

    // pf-m-info must be preserved after toggle
    await expect(first).toHaveClass(/pf-m-info/);

    // pf-m-read must have changed
    if (wasRead) {
      await expect(first).not.toHaveClass(/pf-m-read/, { timeout: 5000 });
    } else {
      await expect(first).toHaveClass(/pf-m-read/, { timeout: 5000 });
    }

    // Open kebab — verify text flipped
    const kebab = first.locator('#notification-item-toggle');
    await kebab.click();
    const dropdown = page.locator('#notification-item-dropdown');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    const expectedText = wasRead ? 'Mark as read' : 'Mark as unread';
    await expect(dropdown.getByRole('menuitem', { name: expectedText })).toBeVisible();
    await kebab.click();

    // Toggle back to restore original state
    await drawerHelpers.toggleReadStatus(page, first);

    // pf-m-info still preserved
    await expect(first).toHaveClass(/pf-m-info/);

    // pf-m-read restored to original
    if (wasRead) {
      await expect(first).toHaveClass(/pf-m-read/, { timeout: 5000 });
    } else {
      await expect(first).not.toHaveClass(/pf-m-read/, { timeout: 5000 });
    }

    const direction = wasRead ? 'read -> unread -> read' : 'unread -> read -> unread';
    console.log(`Toggle complete: ${direction}`);
  });

  // ── 5. Read/unread counts update after toggle ─────────────────────

  test('read/unread counts update after toggling a notification', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    test.skip(count === 0, 'No notifications available');

    // Get initial counts
    const before = await drawerHelpers.getReadUnreadCounts(page);

    // Toggle first item
    const first = items.first();
    const wasRead = await drawerHelpers.isNotificationRead(first);
    await drawerHelpers.toggleReadStatus(page, first);

    // Wait for class change
    if (wasRead) {
      await expect(first).not.toHaveClass(/pf-m-read/, { timeout: 5000 });
    } else {
      await expect(first).toHaveClass(/pf-m-read/, { timeout: 5000 });
    }

    // Verify counts updated
    const after = await drawerHelpers.getReadUnreadCounts(page);
    if (wasRead) {
      expect(after.read).toBe(before.read - 1);
      expect(after.unread).toBe(before.unread + 1);
    } else {
      expect(after.read).toBe(before.read + 1);
      expect(after.unread).toBe(before.unread - 1);
    }

    // Toggle back to restore
    await drawerHelpers.toggleReadStatus(page, first);

    if (wasRead) {
      await expect(first).toHaveClass(/pf-m-read/, { timeout: 5000 });
    } else {
      await expect(first).not.toHaveClass(/pf-m-read/, { timeout: 5000 });
    }

    console.log(
      `Counts: read ${before.read} -> ${after.read}, ` +
        `unread ${before.unread} -> ${after.unread}`
    );
  });
});
