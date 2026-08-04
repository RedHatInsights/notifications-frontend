import { Page, expect, test } from '@playwright/test';
import { NOTIFICATIONS_PATH, ensureLoggedIn } from './test-utils';
import { TIMEOUTS } from './test-constants';
import { waitForSuccessNotification } from './utils/form-helpers';

/**
 * Subscription Threshold E2E Test Suite
 *
 * Tests the subscription utilization threshold feature on the Configure Events
 * page. The threshold (0–100%) controls when "Custom subscription threshold
 * exceeded" notifications fire. Org Admins can edit the threshold inline; the
 * value is persisted via the org-preferences API and reflected on the
 * Notification Preferences page.
 *
 * Covers test cases from RHCLOUD-50000 / RHCLOUD-46646.
 */

const CONFIGURE_EVENTS_PATH = `${NOTIFICATIONS_PATH}/configure-events`;
const USER_PREFERENCES_PATH = `${NOTIFICATIONS_PATH}/user-preferences`;
const THRESHOLD_ROW_TEXT = 'Custom subscription threshold exceeded';
const SUBSCRIPTION_SERVICES_TAB = 'Subscription Services';

// =============================================================================
// Helpers
// =============================================================================

/**
 * Navigate to Configure Events > Subscription Services > Configuration tab
 * and wait for the threshold row to be visible.
 *
 * Returns the table row locator for the threshold event type.
 */
async function navigateToSubscriptionServicesConfig(page: Page) {
  await page.goto(CONFIGURE_EVENTS_PATH);
  await page.waitForLoadState('domcontentloaded');

  // Wait for heading — retry with reload if module federation hasn't hydrated
  const heading = page.getByRole('heading', { name: 'Configure Events' });
  if (!(await heading.isVisible({ timeout: TIMEOUTS.QUICK_CHECK }))) {
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  }
  await expect(heading).toBeVisible({ timeout: TIMEOUTS.PAGE_LOAD });

  // Click "Subscription Services" bundle tab
  const bundleTablist = page.locator('[role="tablist"]').first();
  await bundleTablist.waitFor({ state: 'visible', timeout: TIMEOUTS.PAGE_LOAD });

  const subscriptionTab = bundleTablist.getByRole('tab', {
    name: SUBSCRIPTION_SERVICES_TAB,
  });
  await subscriptionTab.waitFor({ state: 'visible', timeout: TIMEOUTS.PAGE_LOAD });
  await subscriptionTab.click();
  await expect(subscriptionTab).toHaveAttribute('aria-selected', 'true');

  // Wait for bundle panel content to load (Configuration sub-tab renders)
  const panelId = await subscriptionTab.getAttribute('aria-controls');
  const bundlePanel = page.locator(`#${panelId}`);
  await expect(bundlePanel).toBeVisible({ timeout: TIMEOUTS.ELEMENT_APPEAR });

  const configTab = bundlePanel.getByRole('tab', { name: 'Configuration' });
  await expect(configTab).toBeVisible({ timeout: TIMEOUTS.PAGE_LOAD });

  // Wait for the threshold row to appear in the table
  const thresholdRow = page
    .locator('tr', {
      has: page.locator(`text="${THRESHOLD_ROW_TEXT}"`),
    })
    .first();
  await thresholdRow.waitFor({ state: 'visible', timeout: TIMEOUTS.TABLE_LOAD });

  return thresholdRow;
}

/**
 * Read the current threshold value from the read-only display.
 * In read-only mode the cell shows: "{value} % of usage threshold"
 */
async function getCurrentThresholdValue(
  thresholdRow: ReturnType<Page['locator']>
): Promise<number> {
  // The threshold cell is the 4th td (index 3): expand | name | application | behavior/threshold | actions
  const cellText = await thresholdRow.locator('td').nth(3).textContent();
  const match = cellText?.match(/(\d+)\s*%/);
  if (!match) {
    throw new Error(`Could not parse threshold value from cell text: "${cellText}"`);
  }
  return parseInt(match[1], 10);
}

/**
 * Enter edit mode on the threshold row by clicking the pencil icon.
 */
async function enterEditMode(thresholdRow: ReturnType<Page['locator']>) {
  const editButton = thresholdRow.getByRole('button', { name: 'edit' });
  await editButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_APPEAR });
  await editButton.click();
}

/**
 * Set the threshold to a specific value using the NumberInput.
 */
async function setThresholdValue(thresholdRow: ReturnType<Page['locator']>, value: number) {
  const thresholdInput = thresholdRow.getByRole('spinbutton', {
    name: 'Usage threshold percentage',
  });
  await thresholdInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_APPEAR });
  await thresholdInput.fill(String(value));
}

/**
 * Save changes by clicking the check (done) icon.
 */
async function saveChanges(thresholdRow: ReturnType<Page['locator']>) {
  const doneButton = thresholdRow.getByRole('button', { name: 'done' });
  await doneButton.click();
}

/**
 * Cancel changes by clicking the close (cancel) icon.
 */
async function cancelChanges(thresholdRow: ReturnType<Page['locator']>) {
  const cancelButton = thresholdRow.getByRole('button', { name: 'cancel' });
  await cancelButton.click();
}

/**
 * Pick a new threshold value that is explicitly different from the current one.
 */
function pickDifferentThreshold(current: number): number {
  // Toggle between 42 and 58 to avoid boundary values (0/100) and default (80)
  return current === 42 ? 58 : 42;
}

// =============================================================================
// Org Admin — Edit Threshold and Verify
// =============================================================================

test.describe('Subscription Threshold — Org Admin', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
  });

  test('should edit threshold, verify success notification, and confirm on preferences page', async ({
    page,
  }) => {
    /**
     * Test flow (RHCLOUD-50000 — Org Admin):
     * 1. Navigate to Configure Events > Subscription Services
     * 2. Locate the "Custom subscription threshold exceeded" row
     * 3. Note the current threshold value
     * 4. Edit it to something explicitly different and save
     * 5. Verify success notification appears
     * 6. Navigate to Notification Preferences page
     * 7. Select Subscription Services > Subscriptions usage
     * 8. Verify the newly set value is reflected
     * 9. Restore the original threshold value
     */

    // Steps 1–2: Navigate and locate threshold row
    const thresholdRow = await navigateToSubscriptionServicesConfig(page);

    // Step 3: Note current threshold value
    const originalThreshold = await getCurrentThresholdValue(thresholdRow);
    console.log(`Current threshold: ${originalThreshold}%`);

    // Step 4: Edit threshold to a different value
    const newThreshold = pickDifferentThreshold(originalThreshold);
    console.log(`Setting threshold to: ${newThreshold}%`);

    // Track whether the test value may have been persisted (for cleanup)
    let needsCleanup = false;

    try {
      await enterEditMode(thresholdRow);
      await setThresholdValue(thresholdRow, newThreshold);

      // Flag cleanup before save — after this point the value may be persisted
      needsCleanup = true;
      await saveChanges(thresholdRow);

      // Step 5: Verify success notification appears
      await waitForSuccessNotification(page);

      // Verify the notification message mentions the new threshold
      await expect(page.getByText(`Custom threshold set to ${newThreshold}%`)).toBeVisible({
        timeout: TIMEOUTS.ELEMENT_APPEAR,
      });

      // Step 6: Navigate to Notification Preferences page
      await page.goto(USER_PREFERENCES_PATH);
      await page.waitForLoadState('domcontentloaded');

      // Step 7: Find the preference item for the threshold event type
      // Scope assertions to the item containing THRESHOLD_ROW_TEXT to avoid
      // matching unrelated "Subscription Services" controls on the page.
      const thresholdPreferenceItem = page
        .locator('section, [class*="preference"], tr, li', {
          hasText: THRESHOLD_ROW_TEXT,
        })
        .first();

      // If the section is collapsed, expand it by clicking the bundle/application toggle
      const subscriptionServicesToggle = page
        .getByRole('button', { name: /Subscription Services/i })
        .or(page.getByRole('tab', { name: /Subscription Services/i }));
      if (
        await subscriptionServicesToggle
          .isVisible({ timeout: TIMEOUTS.QUICK_CHECK })
          .catch(() => false)
      ) {
        await subscriptionServicesToggle.click();
      }

      // Wait for the threshold preference item to be visible (replaces hard-coded timeout)
      await expect(thresholdPreferenceItem).toBeVisible({ timeout: TIMEOUTS.PAGE_LOAD });

      // Step 8: Verify the newly set value is reflected within the scoped item
      await expect(
        thresholdPreferenceItem
          .getByText(`${newThreshold}%`)
          .or(thresholdPreferenceItem.getByText(`${newThreshold} %`))
      ).toBeVisible({
        timeout: TIMEOUTS.PAGE_LOAD,
      });
    } finally {
      // Step 9: Restore original threshold (always runs to keep stage clean)
      if (needsCleanup) {
        const restoreRow = await navigateToSubscriptionServicesConfig(page);
        await enterEditMode(restoreRow);
        await setThresholdValue(restoreRow, originalThreshold);
        await saveChanges(restoreRow);

        // Verify restoration succeeded
        await expect(page.getByText(`Custom threshold set to ${originalThreshold}%`)).toBeVisible({
          timeout: TIMEOUTS.ELEMENT_APPEAR,
        });

        console.log(`✓ Threshold restored to ${originalThreshold}%`);
      }
    }
  });
});

// =============================================================================
// Org Admin — Cancel Editing
// =============================================================================

test.describe('Subscription Threshold — Cancel Editing', () => {
  test.beforeEach(async ({ page }) => {
    await ensureLoggedIn(page);
  });

  test('should revert threshold value when editing is cancelled', async ({ page }) => {
    /**
     * Test flow (RHCLOUD-50000 — Org Admin Cancel):
     * 1. Navigate to Configure Events > Subscription Services
     * 2. Enter edit mode on the threshold row
     * 3. Change the threshold value
     * 4. Cancel editing
     * 5. Verify the threshold value reverts to its original value
     */

    // Step 1: Navigate and locate threshold row
    const thresholdRow = await navigateToSubscriptionServicesConfig(page);

    // Note the original value
    const originalThreshold = await getCurrentThresholdValue(thresholdRow);
    console.log(`Original threshold: ${originalThreshold}%`);

    // Step 2: Enter edit mode
    await enterEditMode(thresholdRow);

    // Step 3: Change value to something different
    const tempThreshold = pickDifferentThreshold(originalThreshold);
    await setThresholdValue(thresholdRow, tempThreshold);

    // Verify the input shows the new value before cancelling
    const thresholdInput = thresholdRow.getByRole('spinbutton', {
      name: 'Usage threshold percentage',
    });
    await expect(thresholdInput).toHaveValue(String(tempThreshold));

    // Step 4: Cancel editing
    await cancelChanges(thresholdRow);

    // Step 5: Verify value reverted — row should be back in read-only mode
    // Wait for edit mode to exit (pencil icon reappears)
    const editButton = thresholdRow.getByRole('button', { name: 'edit' });
    await expect(editButton).toBeVisible({ timeout: TIMEOUTS.ELEMENT_APPEAR });

    // Verify the displayed value matches the original
    const revertedThreshold = await getCurrentThresholdValue(thresholdRow);
    expect(revertedThreshold).toBe(originalThreshold);

    console.log(`✓ Threshold reverted to ${originalThreshold}% after cancel`);
  });
});

// =============================================================================
// Normal User — TODO (not yet automatable)
// =============================================================================

/**
 * TODO: Normal User test cases (RHCLOUD-50000)
 *
 * notifications-frontend is not currently configured to support multiple
 * testing users. The following steps should be implemented when multi-user
 * support is available:
 *
 * 1. Log in as a non-admin user and navigate to the Configure Events page
 * 2. Click on the Subscription Services tab and locate the
 *    "Custom subscription threshold exceeded" row
 * 3. Confirm that the edit option is disabled for this user type
 *    (the pencil/edit button should not be rendered or should be disabled)
 *
 * A follow-up card should be added to the backlog to implement these tests
 * when multi-user E2E support is available.
 */
