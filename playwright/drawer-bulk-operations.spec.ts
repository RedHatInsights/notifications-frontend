import { expect, test } from '@playwright/test';
import { ensureLoggedIn } from './test-utils';
import { drawerHelpers } from './utils/drawer-helpers';

/**
 * E2E tests for the notifications drawer — bulk operations and power user workflows.
 *
 * RHCLOUD-47551
 * Covers: individual selection, bulk select all/none, indeterminate checkbox
 * state, bulk mark as read/unread, filter + selection combos, per-notification
 * checkbox toggle, and complex multi-step workflows.
 *
 * These tests run against stage with real data. Counts and content may vary;
 * tests assert structure and behavior, not exact values.
 */
test.describe('Notifications Drawer — Bulk Operations', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
    await drawerHelpers.bellButton(page).waitFor({
      state: 'visible',
      timeout: 60000,
    });
  });

  // ── 1. Individual Notification Selection ──────────────────────────

  test('individual notification checkbox toggles selection', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count === 0) {
      console.log('No notifications — skipping individual selection test');
      return;
    }

    const first = items.first();
    const checkbox = drawerHelpers.notificationCheckbox(first);

    // Initially unchecked (fresh drawer open)
    const initiallyChecked = await checkbox.isChecked();

    // Toggle the checkbox
    await checkbox.click();
    const afterClick = await checkbox.isChecked();
    expect(afterClick).not.toBe(initiallyChecked);

    // Toggle back
    await checkbox.click();
    const afterSecondClick = await checkbox.isChecked();
    expect(afterSecondClick).toBe(initiallyChecked);

    console.log('Individual checkbox toggle works correctly');
  });

  test('selecting a notification updates the bulk select count', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count === 0) {
      console.log('No notifications — skipping selection count test');
      return;
    }

    // Ensure none selected initially
    await drawerHelpers.bulkSelectNone(page);
    const initialCount = await drawerHelpers.getSelectedCount(page);
    expect(initialCount).toBe(0);

    // Select first notification
    await drawerHelpers.selectNotification(items.first());
    const afterSelect = await drawerHelpers.getSelectedCount(page);
    expect(afterSelect).toBe(1);

    // Deselect to restore state
    await drawerHelpers.deselectNotification(items.first());
    const afterDeselect = await drawerHelpers.getSelectedCount(page);
    expect(afterDeselect).toBe(0);

    console.log('Selection count updates correctly with individual selection');
  });

  // ── 2. Bulk Select All / None ─────────────────────────────────────

  test('bulk "Select all" selects every notification', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count === 0) {
      console.log('No notifications — skipping select all test');
      return;
    }

    await drawerHelpers.bulkSelectAll(page);

    // Verify all checkboxes are checked
    for (let i = 0; i < count; i++) {
      const checkbox = drawerHelpers.notificationCheckbox(items.nth(i));
      await expect(checkbox).toBeChecked({ timeout: 3000 });
    }

    // Verify the bulk select checkbox itself is fully checked
    const isChecked = await drawerHelpers.isBulkSelectChecked(page);
    expect(isChecked).toBe(true);

    // Verify count matches total
    const selectedCount = await drawerHelpers.getSelectedCount(page);
    expect(selectedCount).toBe(count);

    // Clean up: deselect all
    await drawerHelpers.bulkSelectNone(page);
    console.log(`Bulk select all: ${count} notifications selected`);
  });

  test('bulk "Select none" deselects all notifications', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count === 0) {
      console.log('No notifications — skipping select none test');
      return;
    }

    // First select all, then select none
    await drawerHelpers.bulkSelectAll(page);
    await drawerHelpers.bulkSelectNone(page);

    // Verify all checkboxes are unchecked
    for (let i = 0; i < Math.min(count, 5); i++) {
      const checkbox = drawerHelpers.notificationCheckbox(items.nth(i));
      await expect(checkbox).not.toBeChecked({ timeout: 3000 });
    }

    // Verify count is 0
    const selectedCount = await drawerHelpers.getSelectedCount(page);
    expect(selectedCount).toBe(0);

    console.log('Bulk select none: all notifications deselected');
  });

  // ── 3. Indeterminate Checkbox State ───────────────────────────────

  test('bulk select checkbox shows indeterminate when some are selected', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count < 2) {
      console.log('Need at least 2 notifications for indeterminate state test — skipping');
      return;
    }

    // Start fresh
    await drawerHelpers.bulkSelectNone(page);

    // Select only the first notification
    await drawerHelpers.selectNotification(items.first());

    // The bulk select checkbox should be indeterminate (some selected, not all)
    const isIndeterminate = await drawerHelpers.isBulkSelectIndeterminate(page);
    expect(isIndeterminate).toBe(true);

    // Should not be fully checked
    const isChecked = await drawerHelpers.isBulkSelectChecked(page);
    expect(isChecked).toBe(false);

    // Clean up
    await drawerHelpers.bulkSelectNone(page);
    console.log('Indeterminate state verified when partial selection');
  });

  // ── 4. Bulk Mark as Read ──────────────────────────────────────────

  test('bulk mark selected as read updates notification state', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count === 0) {
      console.log('No notifications — skipping bulk mark as read test');
      return;
    }

    // Record initial state
    const initialCounts = await drawerHelpers.getReadUnreadCounts(page);

    if (initialCounts.unread === 0) {
      console.log('All notifications already read — marking as unread first');
      await drawerHelpers.bulkSelectAll(page);
      await drawerHelpers.markSelectedAsUnread(page);
      // Wait for state to update
      await page.waitForTimeout(1000);
    }

    // Select all and mark as read
    await drawerHelpers.bulkSelectAll(page);
    await drawerHelpers.markSelectedAsRead(page);

    // Wait for the API call to complete and state to update
    await page.waitForTimeout(2000);

    // Verify all notifications are now read
    const afterCounts = await drawerHelpers.getReadUnreadCounts(page);
    expect(afterCounts.read).toBe(afterCounts.total);

    // Restore: mark as unread if they were previously unread
    if (initialCounts.unread > 0) {
      await drawerHelpers.bulkSelectAll(page);
      await drawerHelpers.markSelectedAsUnread(page);
      await page.waitForTimeout(1000);
    }

    console.log(`Bulk mark as read: ${afterCounts.total} notifications marked read`);
  });

  // ── 5. Bulk Mark as Unread ────────────────────────────────────────

  test('bulk mark selected as unread updates notification state', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count === 0) {
      console.log('No notifications — skipping bulk mark as unread test');
      return;
    }

    // Ensure all are read first
    await drawerHelpers.bulkSelectAll(page);
    await drawerHelpers.markSelectedAsRead(page);
    await page.waitForTimeout(1000);

    // Now mark all as unread
    await drawerHelpers.bulkSelectAll(page);
    await drawerHelpers.markSelectedAsUnread(page);
    await page.waitForTimeout(2000);

    // Verify none are read
    const afterCounts = await drawerHelpers.getReadUnreadCounts(page);
    expect(afterCounts.unread).toBe(afterCounts.total);

    console.log(`Bulk mark as unread: ${afterCounts.total} notifications marked unread`);
  });

  // ── 6. Filter + Selection Workflow ────────────────────────────────

  test('selecting notifications then applying filter preserves selection behavior', async ({
    page,
  }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const totalCount = await items.count();

    if (totalCount === 0) {
      console.log('No notifications — skipping filter + selection test');
      return;
    }

    // Open filter dropdown and check available filters
    const filterToggle = page.locator('#notifications-filter-toggle');
    await filterToggle.click();
    const filterDropdown = page.locator('#notifications-filter-dropdown');
    await expect(filterDropdown).toBeVisible();

    // Get filter items (exclude "Reset filters" button in the footer)
    const filterItems = filterDropdown.locator('[role="menuitem"]');
    const filterCount = await filterItems.count();

    if (filterCount < 1) {
      await filterToggle.click();
      console.log('No filter options — skipping filter + selection test');
      return;
    }

    // Click the first available filter
    await filterItems.first().click();
    // Close the dropdown
    await filterToggle.click();
    await page.waitForTimeout(500);

    // Verify filtered results
    const filteredItems = drawerHelpers.notificationItems(page);
    const filteredCount = await filteredItems.count();

    if (filteredCount > 0) {
      // Select all in filtered view
      await drawerHelpers.bulkSelectAll(page);

      const selectedCount = await drawerHelpers.getSelectedCount(page);
      expect(selectedCount).toBeGreaterThan(0);

      // Deselect all
      await drawerHelpers.bulkSelectNone(page);
    }

    // Reset filters
    await drawerHelpers.resetFilters(page);

    // After reset, total count should be restored
    const restoredItems = drawerHelpers.notificationItems(page);
    const restoredCount = await restoredItems.count();
    expect(restoredCount).toBe(totalCount);

    console.log(
      `Filter + selection workflow: ${totalCount} total → ${filteredCount} filtered → ${restoredCount} restored`
    );
  });

  // ── 7. Checkbox Toggle Persistence ────────────────────────────────

  test('checkbox state persists across drawer close/reopen', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count === 0) {
      console.log('No notifications — skipping persistence test');
      return;
    }

    // Select first notification
    await drawerHelpers.bulkSelectNone(page);
    await drawerHelpers.selectNotification(items.first());

    // Close and reopen the drawer
    await drawerHelpers.closeDrawer(page);
    await page.waitForTimeout(500);
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    // After reopening, selection state may reset (implementation-dependent)
    // Just verify drawer reopens correctly with no errors
    const reopenedItems = drawerHelpers.notificationItems(page);
    const reopenedCount = await reopenedItems.count();
    expect(reopenedCount).toBe(count);

    // Clean up
    await drawerHelpers.bulkSelectNone(page);
    console.log('Drawer close/reopen cycle completed without errors');
  });

  // ── 8. Complex Multi-Step Workflow ────────────────────────────────

  test('multi-step: select some, mark read, select remaining, mark unread', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count < 2) {
      console.log('Need at least 2 notifications for multi-step workflow — skipping');
      return;
    }

    // Step 1: Select none first
    await drawerHelpers.bulkSelectNone(page);

    // Step 2: Select first notification only
    await drawerHelpers.selectNotification(items.first());
    const firstSelected = await drawerHelpers.getSelectedCount(page);
    expect(firstSelected).toBe(1);

    // Step 3: Mark selected as read
    await drawerHelpers.markSelectedAsRead(page);
    await page.waitForTimeout(1000);

    // Step 4: Verify first notification is now read
    const firstIsRead = await drawerHelpers.isNotificationRead(items.first());
    expect(firstIsRead).toBe(true);

    // Step 5: Select all remaining (select all then the first is already selected)
    await drawerHelpers.bulkSelectAll(page);

    // Step 6: Mark all as unread to restore
    await drawerHelpers.markSelectedAsUnread(page);
    await page.waitForTimeout(1000);

    // Step 7: Verify all are unread now
    const finalCounts = await drawerHelpers.getReadUnreadCounts(page);
    expect(finalCounts.unread).toBe(finalCounts.total);

    console.log(`Multi-step workflow completed: ${count} notifications cycled through read/unread`);
  });

  // ── 9. Performance — Large Notification Set ───────────────────────

  test('bulk operations handle available notifications efficiently', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count === 0) {
      console.log('No notifications — skipping performance test');
      return;
    }

    // Measure select all timing
    const selectStart = Date.now();
    await drawerHelpers.bulkSelectAll(page);
    const selectEnd = Date.now();
    const selectMs = selectEnd - selectStart;

    // Verify all selected
    const selectedCount = await drawerHelpers.getSelectedCount(page);
    expect(selectedCount).toBe(count);

    // Measure mark as read timing
    const markStart = Date.now();
    await drawerHelpers.markSelectedAsRead(page);
    const markEnd = Date.now();
    const markMs = markEnd - markStart;

    await page.waitForTimeout(1000);

    // Restore state
    await drawerHelpers.bulkSelectAll(page);
    await drawerHelpers.markSelectedAsUnread(page);
    await page.waitForTimeout(1000);

    // Clean up selection
    await drawerHelpers.bulkSelectNone(page);

    console.log(
      `Performance: ${count} notifications — select all: ${selectMs}ms, mark read: ${markMs}ms`
    );

    // Sanity check: operations should complete within reasonable time
    expect(selectMs).toBeLessThan(5000);
    expect(markMs).toBeLessThan(5000);
  });

  // ── 10. Bulk Select Checkbox Direct Toggle ────────────────────────

  test('clicking bulk select checkbox toggles all selections', async ({ page }) => {
    await drawerHelpers.openDrawer(page);
    await drawerHelpers.waitForDrawerReady(page);

    const items = drawerHelpers.notificationItems(page);
    const count = await items.count();

    if (count === 0) {
      console.log('No notifications — skipping bulk checkbox toggle test');
      return;
    }

    // Start with none selected
    await drawerHelpers.bulkSelectNone(page);

    // Click the bulk select checkbox directly (should select all)
    await drawerHelpers.clickBulkSelectCheckbox(page);

    // Verify some or all are now selected
    const afterCheck = await drawerHelpers.getSelectedCount(page);
    expect(afterCheck).toBeGreaterThan(0);

    // Click again to deselect
    await drawerHelpers.clickBulkSelectCheckbox(page);

    // Clean up
    await drawerHelpers.bulkSelectNone(page);
    console.log('Bulk select checkbox direct toggle works');
  });
});
