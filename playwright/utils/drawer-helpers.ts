import { Locator, Page, expect } from '@playwright/test';

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
    await bell.waitFor({ state: 'visible', timeout: 30000 });
    await bell.click();
    // Wait for the drawer header to appear
    await expect(this.drawerPanel(page).getByText('Notifications').first()).toBeVisible({
      timeout: 15000,
    });
  },

  /** Close the notifications drawer via the X button. */
  async closeDrawer(page: Page): Promise<void> {
    const closeBtn = this.closeButton(page);
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await expect(this.drawerPanel(page)).not.toBeVisible({ timeout: 10000 });
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
    await filterItem.waitFor({ state: 'visible', timeout: 5000 });
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
    await expect(page.locator('#notifications-filter-dropdown')).not.toBeVisible({ timeout: 5000 });
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
    await expect(page.locator('#notification-item-dropdown')).toBeVisible({ timeout: 5000 });
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
    await expect(page.locator('#notification-item-dropdown')).toBeVisible({ timeout: 5000 });
    const manageItem = page
      .locator('#notification-item-dropdown')
      .getByRole('menuitem', { name: 'Manage this event' });
    await manageItem.click();
  },

  /** Open the actions dropdown (header ellipsis). */
  async openActionsDropdown(page: Page): Promise<void> {
    const toggle = page.locator('#notifications-actions-toggle');
    await toggle.click();
    await expect(page.locator('#notifications-actions-dropdown')).toBeVisible({ timeout: 5000 });
  },

  /** Click an item inside the actions dropdown by its visible text. */
  async clickActionItem(page: Page, itemText: string): Promise<void> {
    await this.openActionsDropdown(page);
    const item = page
      .locator('#notifications-actions-dropdown')
      .getByRole('menuitem', { name: itemText });
    await item.click();
  },

  /** Wait for the drawer to finish loading (spinner gone). */
  async waitForDrawerReady(page: Page): Promise<void> {
    // Wait until the spinner disappears — indicates data is loaded
    await expect(this.drawerPanel(page).locator('.pf-v6-c-spinner')).not.toBeVisible({
      timeout: 30000,
    });
  },
};
