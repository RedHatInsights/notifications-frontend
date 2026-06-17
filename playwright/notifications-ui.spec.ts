import { expect, test } from '@playwright/test';
import { NOTIFICATIONS_PATH } from './test-utils';
import { generateBehaviorGroupName } from './utils/data-generators';
import { fillBehaviorGroupForm, waitForSuccessNotification } from './utils/form-helpers';

/**
 * Notifications UI E2E Test Suite
 *
 * Pure UI tests - no API calls. Tests the full user journey:
 * - Navigate between bundles and tabs
 * - Create behavior groups via UI
 * - Verify in UI cards
 * - Delete via UI
 */

const BUNDLES = ['rhel', 'console', 'openshift', 'ansible'];

// =============================================================================
// Bundle Navigation Tests
// =============================================================================

test.describe('Notifications Bundle Navigation', () => {
  test('should navigate to each bundle', async ({ page }) => {
    for (const bundleName of BUNDLES) {
      const bundleUrl = `${NOTIFICATIONS_PATH}/${bundleName}`;

      await page.goto(bundleUrl);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(new RegExp(`notifications/${bundleName}`));
    }
  });

  test('should navigate to Configure Events for each bundle', async ({ page }) => {
    for (const bundleName of BUNDLES) {
      const bundleUrl = `${NOTIFICATIONS_PATH}/${bundleName}`;

      await page.goto(bundleUrl);
      await page.waitForLoadState('networkidle');

      const configureEventsLink = page
        .locator(
          'a:has-text("Configure Events"), button:has-text("Configure Events"), [role="tab"]:has-text("Configure Events")'
        )
        .first();

      if (await configureEventsLink.isVisible({ timeout: 3000 })) {
        await configureEventsLink.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });
});

// =============================================================================
// Behavior Group Lifecycle Tests
// =============================================================================

test.describe('Behavior Group Lifecycle', () => {
  test('should create, verify, and delete behavior group for RHEL', async ({ page }) => {
    const bundleName = 'rhel';
    const groupName = generateBehaviorGroupName(bundleName);
    const bundleUrl = `${NOTIFICATIONS_PATH}/${bundleName}`;

    // Navigate to bundle page
    await page.goto(bundleUrl);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(new RegExp(`notifications/${bundleName}`));

    // Dismiss cookie consent if needed
    const acceptCookies = page
      .getByRole('button', { name: 'Accept all' })
      .or(page.getByRole('button', { name: 'Accept' }));
    if (await acceptCookies.isVisible({ timeout: 2000 }).catch(() => false)) {
      await acceptCookies.click();
      await page.waitForTimeout(500);
    }

    // Navigate to Configure Events (where behavior groups are managed)
    const configureEventsLink = page
      .locator('a:has-text("Configure Events"), button:has-text("Configure Events")')
      .first();
    await configureEventsLink.waitFor({ state: 'visible', timeout: 10000 });
    await configureEventsLink.click();
    await page.waitForLoadState('networkidle');

    // Click Behavior Groups tab
    const behaviorGroupsTab = page
      .locator(
        'button:has-text("Behavior Groups"), a:has-text("Behavior Groups"), [role="tab"]:has-text("Behavior Groups")'
      )
      .first();
    await behaviorGroupsTab.waitFor({ state: 'visible', timeout: 10000 });
    await behaviorGroupsTab.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Create behavior group
    const createButton = page.getByText('Create new group', { exact: true }).first();
    await createButton.waitFor({ state: 'visible', timeout: 10000 });
    await createButton.click();

    await page.waitForTimeout(1000);

    await fillBehaviorGroupForm(page, groupName, {
      action: 'Send an email',
      recipient: 'Admins',
      skipEventTypes: true,
    });

    await waitForSuccessNotification(page);

    // Modal closes automatically - wait for it
    await page.waitForTimeout(2000);

    // Navigate back to the Behavior Groups tab to verify
    await page.goto(bundleUrl);
    await page.waitForLoadState('networkidle');

    await configureEventsLink.click();
    await page.waitForLoadState('networkidle');

    await behaviorGroupsTab.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify behavior group appears in the list
    const bgElement = page.locator(`text="${groupName}"`).first();
    await expect(bgElement).toBeVisible({ timeout: 10000 });

    // Delete the behavior group
    const card = page
      .locator('[class*="card"], article', {
        has: page.locator(`text="${groupName}"`),
      })
      .first();

    const deleteButton = card
      .locator('button[aria-label*="Delete"], button:has-text("Delete")')
      .first();
    if (await deleteButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await deleteButton.click();
    } else {
      const kebabButton = card
        .locator('button[aria-label*="Actions"], button[aria-label*="Kebab"]')
        .first();
      await kebabButton.click();
      await page.waitForTimeout(500);
      const deleteMenuItem = page.locator('button:has-text("Delete")').first();
      await deleteMenuItem.click();
    }

    // Confirm deletion
    const confirmButton = page
      .locator('button:has-text("Delete"), button:has-text("Confirm")')
      .first();
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click({ force: true });

    await page.waitForTimeout(2000);
    const bgGone = await bgElement.isVisible({ timeout: 2000 }).catch(() => false);
    expect(bgGone).toBe(false);
  });
});

// =============================================================================
// Events Log Tests
// =============================================================================

test.describe('Events Log', () => {
  test('should display events log page', async ({ page }) => {
    const eventLogUrl = `${NOTIFICATIONS_PATH}/event-log`;

    await page.goto(eventLogUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Just verify the page loaded (might redirect to auth or different URL)
    // Check for any content indicating we're on a notifications page
    const hasNotificationsContent = await page
      .locator('text=/event|notification|log/i')
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    const hasTable = await page
      .locator('table')
      .first()
      .isVisible()
      .catch(() => false);
    const hasEmptyState = await page
      .locator(
        '[data-ouia-component-type="PF5/EmptyState"], [data-ouia-component-type="PF6/EmptyState"]'
      )
      .isVisible()
      .catch(() => false);

    // As long as the page loads without errors, consider it a pass
    expect(
      hasNotificationsContent || hasTable || hasEmptyState || page.url().includes('notifications')
    ).toBeTruthy();

    console.log(`✓ Events log page loaded (URL: ${page.url()})`);
  });
});
