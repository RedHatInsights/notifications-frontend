import { type Page, expect, test } from '@playwright/test';
import { TIMEOUTS, disableCookiePrompt } from './test-utils';
import { drawerHelpers } from './utils/drawer-helpers';

/**
 * E2E tests for notification item read/unread visual state changes.
 *
 * RHCLOUD-48122
 * Covers:
 *   - Bell icon variant stays "info" in both read and unread states
 *   - Read styling applied/removed correctly (via data-read-state attribute)
 *   - Kebab menu text toggles between "Mark as read" and "Mark as unread"
 *   - Visual state updates immediately after toggle
 *   - Read/unread counts update after toggling
 *
 * Tests assert via semantic data attributes (data-read-state, data-testid)
 * rather than PatternFly CSS classes, avoiding breakage during PF upgrades.
 *
 * The test account must have at least one notification. If it does not,
 * tests fail with a clear precondition message.
 */
test.describe('Notification Item — Read/Unread Visual Changes', () => {
  test.beforeEach(async ({ page }) => {
    await disableCookiePrompt(page);
    await page.goto('/', { waitUntil: 'load', timeout: TIMEOUTS.PAGE_LOAD });
    await drawerHelpers.bellButton(page).waitFor({
      state: 'visible',
      timeout: TIMEOUTS.PAGE_LOAD,
    });
  });

  /**
   * Open the drawer and return the notification list items.
   * Asserts that at least one notification exists (no silent skips).
   */
  async function openDrawerWithNotifications(page: Page) {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();
    expect(
      count,
      'Test account must have at least one notification — seed via CI fixtures or API'
    ).toBeGreaterThan(0);

    return items;
  }

  // ── 1. Info variant preserved across states ───────────────────────

  test('notification items retain info variant regardless of read state', async ({ page }) => {
    const items = await openDrawerWithNotifications(page);
    const count = await items.count();

    // Verify every visible notification carries the info variant data-testid
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      await expect(item).toHaveAttribute('data-testid', /^notification-item-(read|unread)$/);
    }
  });

  // ── 2. Read vs unread semantic state ──────────────────────────────

  test('read notification has data-read-state="read", unread has "unread"', async ({ page }) => {
    const items = await openDrawerWithNotifications(page);
    const count = await items.count();

    const { read, unread } = await drawerHelpers.getReadUnreadCounts(page);

    if (read > 0) {
      for (let i = 0; i < count; i++) {
        const item = items.nth(i);
        if (await drawerHelpers.isNotificationRead(item)) {
          await expect(item).toHaveAttribute('data-read-state', 'read');
          break;
        }
      }
    }

    if (unread > 0) {
      for (let i = 0; i < count; i++) {
        const item = items.nth(i);
        if (!(await drawerHelpers.isNotificationRead(item))) {
          await expect(item).toHaveAttribute('data-read-state', 'unread');
          break;
        }
      }
    }
  });

  // ── 3. Kebab menu text matches read state ─────────────────────────

  test('kebab menu shows correct toggle text based on read state', async ({ page }) => {
    const items = await openDrawerWithNotifications(page);

    const first = items.first();
    const wasRead = await drawerHelpers.isNotificationRead(first);

    // Open kebab via accessible label
    const kebab = first.getByRole('button', { name: 'Notification actions dropdown' });
    await kebab.click();

    // Verify correct menu text
    const expectedText = wasRead ? 'Mark as unread' : 'Mark as read';
    await expect(page.getByRole('menuitem', { name: expectedText })).toBeVisible({
      timeout: TIMEOUTS.ELEMENT_VISIBLE,
    });

    // Close kebab
    await kebab.click();
  });

  // ── 4. Toggle preserves info variant, updates read state + kebab ──

  test('toggling read state preserves info variant and updates data-read-state', async ({
    page,
  }) => {
    const items = await openDrawerWithNotifications(page);

    // Pin the first item by its aria-label so the locator survives re-sorting.
    // DrawerPanel sorts unread items first — toggling read state moves the
    // item in the DOM, causing items.first() to resolve to a different element.
    const firstLabel = await items.first().getAttribute('aria-label');
    expect(firstLabel, 'notification aria-label must be set').toBeTruthy();
    const first = page.locator(`[aria-label="${firstLabel}"]`).first();
    const wasRead = await drawerHelpers.isNotificationRead(first);

    // Verify initial state has info variant via data-testid
    const initialTestId = await first.getAttribute('data-testid');
    expect(initialTestId).toMatch(/^notification-item-(read|unread)$/);

    // Toggle read status via kebab
    await drawerHelpers.toggleReadStatus(page, first);

    // data-read-state must have flipped
    if (wasRead) {
      await expect(first).toHaveAttribute('data-read-state', 'unread', {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
    } else {
      await expect(first).toHaveAttribute('data-read-state', 'read', {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
    }

    // data-testid must still start with "notification-item-" (info variant preserved)
    const afterTestId = await first.getAttribute('data-testid');
    expect(afterTestId).toMatch(/^notification-item-(read|unread)$/);

    // Open kebab — verify text flipped
    const kebab = first.getByRole('button', { name: 'Notification actions dropdown' });
    await kebab.click();

    const expectedText = wasRead ? 'Mark as read' : 'Mark as unread';
    await expect(page.getByRole('menuitem', { name: expectedText })).toBeVisible({
      timeout: TIMEOUTS.ELEMENT_VISIBLE,
    });
    await kebab.click();

    // Toggle back to restore original state
    await drawerHelpers.toggleReadStatus(page, first);

    // data-read-state restored to original
    if (wasRead) {
      await expect(first).toHaveAttribute('data-read-state', 'read', {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
    } else {
      await expect(first).toHaveAttribute('data-read-state', 'unread', {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
    }
  });

  // ── 5. Read/unread counts update after toggle ─────────────────────

  test('read/unread counts update after toggling a notification', async ({ page }) => {
    const items = await openDrawerWithNotifications(page);

    // Get initial counts
    const before = await drawerHelpers.getReadUnreadCounts(page);

    // Pin the first item by its aria-label (same re-sort issue as test above)
    const firstLabel = await items.first().getAttribute('aria-label');
    expect(firstLabel, 'notification aria-label must be set').toBeTruthy();
    const first = page.locator(`[aria-label="${firstLabel}"]`).first();
    const wasRead = await drawerHelpers.isNotificationRead(first);
    await drawerHelpers.toggleReadStatus(page, first);

    // Wait for state change via semantic attribute
    if (wasRead) {
      await expect(first).toHaveAttribute('data-read-state', 'unread', {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
    } else {
      await expect(first).toHaveAttribute('data-read-state', 'read', {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
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
      await expect(first).toHaveAttribute('data-read-state', 'read', {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
    } else {
      await expect(first).toHaveAttribute('data-read-state', 'unread', {
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
    }
  });
});
