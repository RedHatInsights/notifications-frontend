import { expect, test } from '@playwright/test';
import { ensureLoggedIn } from './test-utils';
import { drawerHelpers } from './utils/drawer-helpers';
import { TIMEOUTS } from './test-constants';

/**
 * E2E tests for the notifications drawer — panel-level actions dropdown menu.
 *
 * RHCLOUD-48124
 * Covers: dropdown structure, bulk action disabled/enabled states,
 * dynamic selected-count labels, divider between action groups,
 * and mark-as-read via the panel dropdown.
 *
 * Navigation tests for dropdown links are already covered in
 * drawer-basic-usage.spec.ts — not duplicated here.
 */
test.describe('Notifications Drawer — Panel Dropdown Menu', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
    await drawerHelpers.bellButton(page).waitFor({
      state: 'visible',
      timeout: TIMEOUTS.PAGE_LOAD,
    });
  });

  test('dropdown structure shows bulk actions, divider, and navigation items', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const dropdown = await drawerHelpers.openActionsDropdown(page);

    // Bulk action items
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected \(\d+\) as read/ })
    ).toBeVisible();
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected \(\d+\) as unread/ })
    ).toBeVisible();

    // Divider between bulk actions and navigation items
    await expect(dropdown.getByRole('separator').first()).toBeVisible();

    // Navigation items
    await expect(dropdown.getByRole('menuitem', { name: 'View event log' })).toBeVisible();
    await expect(
      dropdown.getByRole('menuitem', { name: 'Manage my event notifications' })
    ).toBeVisible();
    await expect(
      dropdown.getByRole('menuitem', { name: 'Manage event configuration' })
    ).toBeVisible();

    await drawerHelpers.closeActionsDropdown(page);
  });

  test('bulk actions are disabled when no notifications are selected', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    await drawerHelpers.bulkSelectNone(page);

    const dropdown = await drawerHelpers.openActionsDropdown(page);

    const markRead = dropdown.getByRole('menuitem', { name: /Mark selected \(0\) as read/ });
    const markUnread = dropdown.getByRole('menuitem', { name: /Mark selected \(0\) as unread/ });

    await expect(markRead).toBeVisible();
    await expect(markUnread).toBeVisible();
    await expect(markRead).toBeDisabled();
    await expect(markUnread).toBeDisabled();

    // Navigation items should remain enabled
    const viewLog = dropdown.getByRole('menuitem', { name: 'View event log' });
    await expect(viewLog).toBeEnabled();

    await drawerHelpers.closeActionsDropdown(page);
  });

  test('bulk actions become enabled and show correct count when notifications are selected', async ({
    page,
  }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();
    expect(count, 'Test account must have at least 2 notifications').toBeGreaterThanOrEqual(2);

    await drawerHelpers.bulkSelectNone(page);

    // Select exactly 2 notifications
    await drawerHelpers.selectNotification(items.nth(0));
    await drawerHelpers.selectNotification(items.nth(1));

    const dropdown = await drawerHelpers.openActionsDropdown(page);

    const markRead = dropdown.getByRole('menuitem', { name: /Mark selected \(2\) as read/ });
    const markUnread = dropdown.getByRole('menuitem', { name: /Mark selected \(2\) as unread/ });

    await expect(markRead).toBeVisible();
    await expect(markUnread).toBeVisible();
    await expect(markRead).toBeEnabled();
    await expect(markUnread).toBeEnabled();

    await drawerHelpers.closeActionsDropdown(page);
    await drawerHelpers.bulkSelectNone(page);
  });

  test('bulk action count updates dynamically as selection changes', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const totalCount = await items.count();
    expect(totalCount, 'Test account must have at least 1 notification').toBeGreaterThan(0);

    await drawerHelpers.bulkSelectNone(page);

    // Select 1 → count should be 1
    await drawerHelpers.selectNotification(items.first());

    let dropdown = await drawerHelpers.openActionsDropdown(page);
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected \(1\) as read/ })
    ).toBeVisible();
    await drawerHelpers.closeActionsDropdown(page);

    // Select all → count should match total
    await drawerHelpers.bulkSelectAll(page);

    dropdown = await drawerHelpers.openActionsDropdown(page);
    await expect(
      dropdown.getByRole('menuitem', {
        name: new RegExp(`Mark selected \\(${totalCount}\\) as read`),
      })
    ).toBeVisible();
    await drawerHelpers.closeActionsDropdown(page);

    // Select none → count should be 0
    await drawerHelpers.bulkSelectNone(page);

    dropdown = await drawerHelpers.openActionsDropdown(page);
    await expect(
      dropdown.getByRole('menuitem', { name: /Mark selected \(0\) as read/ })
    ).toBeVisible();
    await drawerHelpers.closeActionsDropdown(page);
  });

  test('mark selected as read via dropdown closes dropdown and updates state', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();
    expect(count, 'Test account must have at least 1 notification').toBeGreaterThan(0);

    // Mark all as unread for a deterministic baseline
    await drawerHelpers.bulkSelectAll(page);
    await drawerHelpers.markSelectedAsUnread(page);
    await expect
      .poll(() => drawerHelpers.getReadUnreadCounts(page).then((c) => c.unread), {
        timeout: TIMEOUTS.PAGE_LOAD,
      })
      .toBe(count);

    // Record baseline: all should be unread
    const beforeCounts = await drawerHelpers.getReadUnreadCounts(page);
    expect(beforeCounts.unread).toBe(beforeCounts.total);

    // Select the first notification and mark as read via the panel dropdown
    await drawerHelpers.bulkSelectNone(page);
    await drawerHelpers.selectNotification(items.first());

    const dropdown = await drawerHelpers.openActionsDropdown(page);
    const markRead = dropdown.getByRole('menuitem', { name: /Mark selected \(\d+\) as read/ });
    await markRead.click();

    // Dropdown should close after the action
    await expect(drawerHelpers.actionsDropdown(page)).not.toBeVisible({
      timeout: TIMEOUTS.QUICK_CHECK,
    });

    // Read count should increase by 1
    await expect
      .poll(() => drawerHelpers.getReadUnreadCounts(page).then((c) => c.read), {
        timeout: TIMEOUTS.PAGE_LOAD,
      })
      .toBeGreaterThanOrEqual(1);

    // Selection should be cleared — reopen dropdown and verify count is 0
    const reopened = await drawerHelpers.openActionsDropdown(page);
    await expect(
      reopened.getByRole('menuitem', { name: /Mark selected \(0\) as read/ })
    ).toBeVisible();
    await drawerHelpers.closeActionsDropdown(page);

    // Restore: mark the notification back to unread so shared account state is clean
    await drawerHelpers.selectNotification(items.first());
    await drawerHelpers.markSelectedAsUnread(page);
    await expect
      .poll(() => drawerHelpers.getReadUnreadCounts(page).then((c) => c.unread), {
        timeout: TIMEOUTS.PAGE_LOAD,
      })
      .toBe(count);
  });
});
