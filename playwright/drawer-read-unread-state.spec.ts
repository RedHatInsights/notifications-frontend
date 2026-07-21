import { type Page, expect, test } from '@playwright/test';
import { TIMEOUTS } from './test-constants';
import { ensureLoggedIn } from './test-utils';
import { drawerHelpers } from './utils/drawer-helpers';

/**
 * E2E tests for notification item read/unread visual state changes.
 *
 * RHCLOUD-48122
 * Covers:
 *   - Read/unread styling via pf-m-read class
 *   - Kebab menu text matches current read state
 *   - Toggling read state updates counts correctly
 *   - Toggling read state changes kebab text
 *
 * NOTE: The drawer sorts notifications read:asc (unread first). Toggling
 * an item's read state causes the list to re-sort, moving the item.
 * Tests verify behavior via count changes rather than tracking individual items.
 *
 * The test account must have at least one notification.
 */
test.describe('Notification Item — Read/Unread Visual Changes', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
    await drawerHelpers.bellButton(page).waitFor({
      state: 'visible',
      timeout: TIMEOUTS.PAGE_LOAD,
    });
  });

  async function openDrawerWithNotifications(page: Page) {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();
    expect(count, 'Test account must have at least one notification').toBeGreaterThan(0);

    return items;
  }

  test('notification items have consistent read/unread class state', async ({ page }) => {
    const items = await openDrawerWithNotifications(page);
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const isRead = await drawerHelpers.isNotificationRead(item);
      const classes = (await item.getAttribute('class')) ?? '';
      if (isRead) {
        expect(classes).toContain('pf-m-read');
      } else {
        expect(classes).not.toContain('pf-m-read');
      }
    }
  });

  test('kebab menu shows correct toggle text based on read state', async ({ page }) => {
    const items = await openDrawerWithNotifications(page);

    const first = items.first();
    const wasRead = await drawerHelpers.isNotificationRead(first);

    const kebab = first.locator('#notification-item-toggle');
    await kebab.click();
    await expect(page.locator('#notification-item-dropdown')).toBeVisible({
      timeout: TIMEOUTS.ELEMENT_APPEAR,
    });

    const expectedText = wasRead ? 'Mark as unread' : 'Mark as read';
    await expect(
      page.locator('#notification-item-dropdown').getByRole('menuitem', { name: expectedText })
    ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_APPEAR });

    await kebab.click();
  });

  test('toggling read state updates pf-m-read class and kebab text', async ({ page }) => {
    const items = await openDrawerWithNotifications(page);

    const first = items.first();

    // Toggle via kebab
    await drawerHelpers.toggleReadStatus(page, first);

    // The drawer re-sorts (unread first), so the toggled item moves.
    // Re-open drawer to get fresh sort order and verify class states
    await drawerHelpers.closeDrawer(page);
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const afterItems = drawerHelpers.notificationItems(page);
    const afterCount = await afterItems.count();

    // Verify all items still have consistent class state
    for (let i = 0; i < afterCount; i++) {
      const item = afterItems.nth(i);
      const isRead = await drawerHelpers.isNotificationRead(item);
      const classes = (await item.getAttribute('class')) ?? '';
      if (isRead) {
        expect(classes).toContain('pf-m-read');
      } else {
        expect(classes).not.toContain('pf-m-read');
      }
    }

    // Verify kebab text matches class state on the first item
    const newFirst = afterItems.first();
    const newFirstRead = await drawerHelpers.isNotificationRead(newFirst);
    const kebab = newFirst.locator('#notification-item-toggle');
    await kebab.click();
    await expect(page.locator('#notification-item-dropdown')).toBeVisible({
      timeout: TIMEOUTS.ELEMENT_APPEAR,
    });
    const expectedText = newFirstRead ? 'Mark as unread' : 'Mark as read';
    await expect(
      page.locator('#notification-item-dropdown').getByRole('menuitem', { name: expectedText })
    ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_APPEAR });
    await kebab.click();

    // Restore: toggle the first item back (this toggles a different item
    // but keeps the overall read/unread balance roughly the same)
    await drawerHelpers.toggleReadStatus(page, newFirst);
  });

  test('read/unread counts update after toggling a notification', async ({ page }) => {
    const items = await openDrawerWithNotifications(page);

    const before = await drawerHelpers.getReadUnreadCounts(page);

    const first = items.first();
    const wasRead = await drawerHelpers.isNotificationRead(first);

    // Toggle via kebab
    await drawerHelpers.toggleReadStatus(page, first);

    // Poll counts until they reflect the change
    const expectedRead = wasRead ? before.read - 1 : before.read + 1;
    const expectedUnread = wasRead ? before.unread + 1 : before.unread - 1;

    await expect
      .poll(
        async () => {
          const c = await drawerHelpers.getReadUnreadCounts(page);
          return c.read;
        },
        { timeout: TIMEOUTS.ELEMENT_APPEAR }
      )
      .toBe(expectedRead);

    const after = await drawerHelpers.getReadUnreadCounts(page);
    expect(after.read).toBe(expectedRead);
    expect(after.unread).toBe(expectedUnread);

    // Restore: toggle the first item (now a different notification
    // since the list re-sorted)
    const newFirst = drawerHelpers.notificationItems(page).first();
    await drawerHelpers.toggleReadStatus(page, newFirst);
  });
});
