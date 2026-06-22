import { Locator, Page, expect } from '@playwright/test';
import { TIMEOUTS } from './timeouts';

/**
 * Helper utilities for interacting with the notifications drawer in E2E tests.
 *
 * Selectors are derived from the actual component source:
 *   - DrawerBell.tsx: NotificationBadge with aria-label="Notifications"
 *   - DrawerPanel.tsx: NotificationDrawerHeader with title="Notifications"
 *   - Dropdowns.tsx: filter/action dropdowns with specific IDs
 *   - NotificationItem.tsx: per-notification actions
 */
export const drawerHelpers = {
  /** Locator for the notification bell button in the header toolbar. */
  bellButton(page: Page): Locator {
    return page.locator('button[aria-label="Notifications"]');
  },

  /** Locator for the drawer panel (visible after opening). */
  drawerPanel(page: Page): Locator {
    return page.locator('.pf-v6-c-notification-drawer');
  },

  /** Locator for the drawer header close button. */
  closeButton(page: Page): Locator {
    return this.drawerPanel(page).locator(
      'button.pf-v6-c-notification-drawer__header-action-close, button[aria-label="Close"]'
    );
  },

  /** Open the notifications drawer by clicking the bell icon. */
  async openDrawer(page: Page): Promise<void> {
    const bell = this.bellButton(page);
    await bell.waitFor({ state: 'visible', timeout: TIMEOUTS.DRAWER_LOAD });
    await bell.click();
    // Wait for the drawer header to appear
    await expect(this.drawerPanel(page).getByText('Notifications').first()).toBeVisible({
      timeout: TIMEOUTS.DRAWER_CONTENT,
    });
  },

  /** Close the notifications drawer via the X button. */
  async closeDrawer(page: Page): Promise<void> {
    const closeBtn = this.closeButton(page);
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await expect(this.drawerPanel(page)).not.toBeVisible({ timeout: TIMEOUTS.API_POLL });
    }
  },

  /** Return the unread notification count shown on the badge (0 if hidden). */
  async getUnreadCount(page: Page): Promise<number> {
    const bell = this.bellButton(page);
    const badge = bell.locator('.pf-v6-c-notification-badge__count');
    if (await badge.isVisible().catch(() => false)) {
      const text = await badge.textContent();
      return parseInt(text ?? '0', 10) || 0;
    }
    return 0;
  },

  /** Check whether the bell badge indicates unread notifications. */
  async hasUnreadVariant(page: Page): Promise<boolean> {
    const bell = this.bellButton(page);
    const cls = (await bell.getAttribute('class')) ?? '';
    return cls.includes('unread');
  },

  /** Open the filter dropdown and select (toggle) a bundle filter. */
  async applyFilter(page: Page, filterName: string): Promise<void> {
    const filterToggle = page.locator('#notifications-filter-toggle');
    await filterToggle.click();
    const filterItem = page.getByRole('menuitem', { name: filterName });
    await filterItem.waitFor({ state: 'visible', timeout: TIMEOUTS.UI_FEEDBACK });
    await filterItem.click();
    // Close the dropdown by clicking the toggle again
    await filterToggle.click();
  },

  /** Reset all active filters via the "Reset filters" button inside the filter dropdown. */
  async resetFilters(page: Page): Promise<void> {
    const filterToggle = page.locator('#notifications-filter-toggle');
    await filterToggle.click();
    const resetBtn = page.getByRole('menuitem', { name: 'Reset filters' });
    await resetBtn.click();
    // Wait for dropdown to close after reset
    await expect(page.locator('#notifications-filter-dropdown')).not.toBeVisible({
      timeout: TIMEOUTS.UI_FEEDBACK,
    });
  },

  /**
   * Get all notification list items currently visible in the drawer.
   * Each item has aria-label="Notification item <title>".
   */
  notificationItems(page: Page): Locator {
    return page.locator('[aria-label^="Notification item"]');
  },

  /** Open the per-notification kebab menu and click "Mark as read" or "Mark as unread". */
  async toggleReadStatus(page: Page, notificationLocator: Locator): Promise<void> {
    const kebab = notificationLocator.locator('#notification-item-toggle');
    await kebab.click();
    await expect(page.locator('#notification-item-dropdown')).toBeVisible({
      timeout: TIMEOUTS.UI_FEEDBACK,
    });
    // The menu item text is dynamic: "Mark as read" or "Mark as unread"
    const markItem = page
      .locator('#notification-item-dropdown')
      .getByRole('menuitem', { name: /Mark as/ });
    await markItem.click();
  },

  /** Open the per-notification kebab and click "Manage this event". */
  async clickManageEvent(page: Page, notificationLocator: Locator): Promise<void> {
    const kebab = notificationLocator.locator('#notification-item-toggle');
    await kebab.click();
    await expect(page.locator('#notification-item-dropdown')).toBeVisible({
      timeout: TIMEOUTS.UI_FEEDBACK,
    });
    const manageItem = page
      .locator('#notification-item-dropdown')
      .getByRole('menuitem', { name: 'Manage this event' });
    await manageItem.click();
  },

  /** Locator for the actions dropdown toggle (ellipsis button). */
  actionsToggle(page: Page): Locator {
    return page.getByRole('button', { name: 'Notifications actions dropdown' });
  },

  /** Locator for the actions dropdown menu container. */
  actionsDropdown(page: Page): Locator {
    return page.locator('#notifications-actions-dropdown');
  },

  /** Open the actions dropdown (header ellipsis) and return the dropdown locator. */
  async openActionsDropdown(page: Page): Promise<Locator> {
    const toggle = this.actionsToggle(page);
    await toggle.click();
    const dropdown = this.actionsDropdown(page);
    await expect(dropdown).toBeVisible({ timeout: TIMEOUTS.UI_FEEDBACK });
    return dropdown;
  },

  /** Close the actions dropdown by clicking the toggle again. */
  async closeActionsDropdown(page: Page): Promise<void> {
    await this.actionsToggle(page).click();
  },

  /** Click an item inside the actions dropdown by its visible text. */
  async clickActionItem(page: Page, itemText: string): Promise<void> {
    const dropdown = await this.openActionsDropdown(page);
    const item = dropdown.getByRole('menuitem', { name: itemText });
    await item.click();
  },

  /**
   * Read the `data-selected-count` attribute from a bulk action menu item.
   * Requires the actions dropdown to be open.
   */
  async getSelectedCountFromDropdown(page: Page): Promise<number> {
    const dropdown = this.actionsDropdown(page);
    const markRead = dropdown.getByRole('menuitem', { name: /Mark selected .* as read/ });
    const countAttr = await markRead.getAttribute('data-selected-count');
    return parseInt(countAttr ?? '0', 10);
  },

  /** Wait for the drawer to finish loading (spinner gone). */
  async waitForDrawerReady(page: Page): Promise<void> {
    // Wait until the spinner disappears — indicates data is loaded
    await expect(this.drawerPanel(page).locator('.pf-v6-c-spinner')).not.toBeVisible({
      timeout: TIMEOUTS.DRAWER_LOAD,
    });
  },

  // ── Bulk selection helpers ─────────────────────────────────────────

  /** Locator for the BulkSelect container. */
  bulkSelectContainer(page: Page): Locator {
    return page.locator('#notifications-bulk-select');
  },

  /** Click the BulkSelect main checkbox (toggle all/none). */
  async clickBulkSelectCheckbox(page: Page): Promise<void> {
    const checkbox = this.bulkSelectContainer(page).locator('input[type="checkbox"]');
    await checkbox.click();
  },

  /** Open the BulkSelect dropdown (the caret/arrow next to the checkbox). */
  async openBulkSelectDropdown(page: Page): Promise<void> {
    const toggle = this.bulkSelectContainer(page).locator('button.pf-v6-c-menu-toggle');
    await toggle.click();
    // Wait for toggle to indicate menu is open (avoids matching unrelated PF menus)
    await expect(toggle).toHaveAttribute('aria-expanded', 'true', {
      timeout: TIMEOUTS.UI_FEEDBACK,
    });
  },

  /** Click "Select all (N)" in the bulk select dropdown. */
  async bulkSelectAll(page: Page): Promise<void> {
    await this.openBulkSelectDropdown(page);
    await page.getByRole('menuitem', { name: /Select all/ }).click();
  },

  /** Click "Select none (0)" in the bulk select dropdown. */
  async bulkSelectNone(page: Page): Promise<void> {
    await this.openBulkSelectDropdown(page);
    await page.getByRole('menuitem', { name: /Select none/ }).click();
  },

  /** Get the count of currently selected notifications (from BulkSelect badge). */
  async getSelectedCount(page: Page): Promise<number> {
    const container = this.bulkSelectContainer(page);
    const text = await container.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  },

  /** Check if the BulkSelect checkbox is in indeterminate state. */
  async isBulkSelectIndeterminate(page: Page): Promise<boolean> {
    const checkbox = this.bulkSelectContainer(page).locator('input[type="checkbox"]');
    return checkbox.evaluate((el: HTMLInputElement) => el.indeterminate);
  },

  /** Check if the BulkSelect checkbox is fully checked. */
  async isBulkSelectChecked(page: Page): Promise<boolean> {
    const checkbox = this.bulkSelectContainer(page).locator('input[type="checkbox"]');
    return checkbox.isChecked();
  },

  /** Get the checkbox locator for a specific notification item. */
  notificationCheckbox(notificationLocator: Locator): Locator {
    return notificationLocator.locator('input[type="checkbox"]');
  },

  /** Select a specific notification by clicking its checkbox. */
  async selectNotification(notificationLocator: Locator): Promise<void> {
    const checkbox = this.notificationCheckbox(notificationLocator);
    if (!(await checkbox.isChecked())) {
      await checkbox.click();
    }
  },

  /** Deselect a specific notification by clicking its checkbox. */
  async deselectNotification(notificationLocator: Locator): Promise<void> {
    const checkbox = this.notificationCheckbox(notificationLocator);
    if (await checkbox.isChecked()) {
      await checkbox.click();
    }
  },

  /** Open the actions dropdown and click "Mark selected as read". */
  async markSelectedAsRead(page: Page): Promise<void> {
    await this.openActionsDropdown(page);
    const item = page
      .locator('#notifications-actions-dropdown')
      .getByRole('menuitem', { name: 'Mark selected as read' });
    await item.click();
  },

  /** Open the actions dropdown and click "Mark selected as unread". */
  async markSelectedAsUnread(page: Page): Promise<void> {
    await this.openActionsDropdown(page);
    const item = page
      .locator('#notifications-actions-dropdown')
      .getByRole('menuitem', { name: 'Mark selected as unread' });
    await item.click();
  },

  /** Check whether a notification item has the "read" state. */
  async isNotificationRead(notificationLocator: Locator): Promise<boolean> {
    return notificationLocator.evaluate((el) => el.classList.contains('pf-m-read'));
  },

  /**
   * Count how many notifications are in "read" vs "unread" state.
   * Returns { read, unread, total }.
   */
  async getReadUnreadCounts(page: Page): Promise<{ read: number; unread: number; total: number }> {
    const items = this.notificationItems(page);
    const total = await items.count();
    let read = 0;
    for (let i = 0; i < total; i++) {
      const item = items.nth(i);
      if (await this.isNotificationRead(item)) {
        read++;
      }
    }
    return { read, unread: total - read, total };
  },
};
