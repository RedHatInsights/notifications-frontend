import { Locator, Page, expect } from '@playwright/test';
import { TIMEOUTS } from '../test-utils';

/**
 * Helper utilities for interacting with the notifications drawer in E2E tests.
 *
 * Selectors use semantic approaches (roles, aria-labels, data attributes)
 * rather than PatternFly CSS classes for resilience across PF version upgrades.
 *
 * PF6 Dropdown menus render via Popper portal to document.body, so menuitem
 * lookups use page-scoped `getByRole` instead of scoping to the dropdown
 * container element.
 */
export const drawerHelpers = {
  /** Locator for the notification bell button in the header toolbar. */
  bellButton(page: Page): Locator {
    return page.getByRole('button', { name: 'Notifications' });
  },

  /** Locator for the drawer panel (visible after opening). */
  drawerPanel(page: Page): Locator {
    return page.locator('.pf-v6-c-notification-drawer');
  },

  /** Locator for the drawer header close button. */
  closeButton(page: Page): Locator {
    return this.drawerPanel(page).getByRole('button', { name: 'Close' });
  },

  /** Open the notifications drawer by clicking the bell icon. */
  async openDrawer(page: Page): Promise<void> {
    const bell = this.bellButton(page);
    await bell.waitFor({ state: 'visible', timeout: TIMEOUTS.DRAWER_READY });
    await bell.click();
    // Wait for the drawer header to appear
    await expect(this.drawerPanel(page).getByText('Notifications').first()).toBeVisible({
      timeout: TIMEOUTS.DRAWER_READY,
    });
  },

  /** Close the notifications drawer via the X button. */
  async closeDrawer(page: Page): Promise<void> {
    const closeBtn = this.closeButton(page);
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await expect(this.drawerPanel(page)).not.toBeVisible({
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });
    }
  },

  /** Return the unread notification count shown on the badge (0 if hidden). */
  async getUnreadCount(page: Page): Promise<number> {
    const bell = this.bellButton(page);
    // PF6 NotificationBadge renders count inside a child span
    const badge = bell.locator('span').filter({ hasText: /^\d+$/ });
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
    await filterItem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });
    await filterItem.click();
    // Close the dropdown by clicking the toggle again
    await filterToggle.click();
  },

  /** Reset all active filters via the "Reset filters" button inside the filter dropdown. */
  async resetFilters(page: Page): Promise<void> {
    const filterToggle = page.locator('#notifications-filter-toggle');
    await filterToggle.click();
    const resetBtn = page.getByRole('button', { name: 'Reset filters' });
    await resetBtn.click();
    // Wait for dropdown to close after reset
    await expect(page.locator('#notifications-filter-dropdown')).not.toBeVisible({
      timeout: TIMEOUTS.ELEMENT_VISIBLE,
    });
  },

  /**
   * Get all notification list items currently visible in the drawer.
   * Each item has aria-label="Notification item <title>".
   */
  notificationItems(page: Page): Locator {
    return page.locator('[aria-label^="Notification item"]');
  },

  /**
   * Open the per-notification kebab menu and click "Mark as read" or "Mark as unread".
   *
   * Uses page-scoped menuitem lookup because PF6 Dropdown renders via Popper
   * portal — menu items are not DOM children of the dropdown container.
   */
  async toggleReadStatus(page: Page, notificationLocator: Locator): Promise<void> {
    const kebab = notificationLocator.getByRole('button', {
      name: 'Notification actions dropdown',
    });
    await kebab.click();

    // Wait for the kebab menu to render (portal)
    const markItem = page.getByRole('menuitem', { name: /Mark as/ });
    await markItem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });
    await markItem.click();
  },

  /** Open the per-notification kebab and click "Manage my event notifications". */
  async clickManageEvent(page: Page, notificationLocator: Locator): Promise<void> {
    const kebab = notificationLocator.getByRole('button', {
      name: 'Notification actions dropdown',
    });
    await kebab.click();

    const manageItem = page.getByRole('menuitem', {
      name: 'Manage my event notifications',
    });
    await manageItem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });
    await manageItem.click();
  },

  /** Open the actions dropdown (header ellipsis). */
  async openActionsDropdown(page: Page): Promise<void> {
    const toggle = page.locator('#notifications-actions-toggle');
    await toggle.click();
    // Wait for a menuitem to appear (portal-safe)
    await page
      .getByRole('menuitem', { name: 'View event log' })
      .waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });
  },

  /** Click an item inside the actions dropdown by its visible text. */
  async clickActionItem(page: Page, itemText: string): Promise<void> {
    await this.openActionsDropdown(page);
    const item = page.getByRole('menuitem', { name: itemText });
    await item.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });
    await item.click();
  },

  /** Wait for the drawer to finish loading (spinner gone). */
  async waitForDrawerReady(page: Page): Promise<void> {
    // PF6 Spinner renders with role="progressbar" — use semantic selector
    const spinner = this.drawerPanel(page).getByRole('progressbar');
    await expect(spinner).not.toBeVisible({ timeout: TIMEOUTS.SPINNER_GONE });
  },

  // ── Bulk selection helpers ─────────────────────────────────────────

  /** Locator for the BulkSelect toggle button (FEC BulkSelect). */
  bulkSelectToggle(page: Page): Locator {
    // FEC BulkSelect renders a single MenuToggle <button> (not split-button).
    // Use element+attribute selector to match only the button, not the Menu
    // which also carries the same data-ouia-component-id.
    return page.locator('button[data-ouia-component-id="BulkSelect"]');
  },

  /** Click the BulkSelect main checkbox (toggle all/none). */
  async clickBulkSelectCheckbox(page: Page): Promise<void> {
    const checkbox = this.bulkSelectToggle(page).getByRole('checkbox');
    await checkbox.click();
  },

  /** Open the BulkSelect dropdown (the caret/arrow next to the checkbox). */
  async openBulkSelectDropdown(page: Page): Promise<void> {
    const toggle = this.bulkSelectToggle(page);
    await toggle.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });

    // FEC BulkSelect renders MenuToggleCheckbox as children (not splitButtonItems),
    // so PF6 renders a single <button> — no nested caret button exists.
    // Click the controls/caret area to open the dropdown without toggling the checkbox.
    const caret = toggle.locator('.pf-v6-c-menu-toggle__controls');
    await caret.click();

    // Wait for the menu to open by checking for visible menu items (portal-safe)
    await page
      .getByRole('menuitem', { name: /Select/ })
      .first()
      .waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });
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
    const toggle = this.bulkSelectToggle(page);
    const text = await toggle.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  },

  /** Check if the BulkSelect checkbox is in indeterminate state. */
  async isBulkSelectIndeterminate(page: Page): Promise<boolean> {
    const checkbox = this.bulkSelectToggle(page).getByRole('checkbox');
    return checkbox.evaluate((el: HTMLInputElement) => el.indeterminate);
  },

  /** Check if the BulkSelect checkbox is fully checked. */
  async isBulkSelectChecked(page: Page): Promise<boolean> {
    const checkbox = this.bulkSelectToggle(page).getByRole('checkbox');
    return checkbox.isChecked();
  },

  /** Get the checkbox locator for a specific notification item. */
  notificationCheckbox(notificationLocator: Locator): Locator {
    return notificationLocator.getByRole('checkbox');
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
    const item = page.getByRole('menuitem', { name: /Mark selected.*as read/ });
    await item.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });
    await item.click();
  },

  /** Open the actions dropdown and click "Mark selected as unread". */
  async markSelectedAsUnread(page: Page): Promise<void> {
    await this.openActionsDropdown(page);
    const item = page.getByRole('menuitem', { name: /Mark selected.*as unread/ });
    await item.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });
    await item.click();
  },

  /** Check whether a notification item has the "read" state via semantic data attribute. */
  async isNotificationRead(notificationLocator: Locator): Promise<boolean> {
    const readState = await notificationLocator.getAttribute('data-read-state');
    if (readState !== null) {
      return readState === 'read';
    }
    // Fallback for items without the semantic attribute
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
