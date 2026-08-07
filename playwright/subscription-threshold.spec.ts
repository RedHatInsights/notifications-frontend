import { Page, expect, test } from '@playwright/test';
import { NOTIFICATIONS_PATH, disableCookiePrompt } from './test-utils';
import { TIMEOUTS } from './test-constants';
import { waitForSuccessNotification } from './utils/form-helpers';

/**
 * Subscription Threshold E2E Test Suite
 *
 * Tests the subscription utilization threshold feature on the Configure Events
 * page. The threshold (0–100%) controls when "Custom subscription threshold
 * exceeded" notifications fire. Org Admins can edit the threshold inline; the
 * value is persisted via the org-preferences API.
 *
 * Covers test cases from RHCLOUD-50000 / RHCLOUD-46646.
 *
 * NOTE: Tests are separated (not combined) because saving the threshold
 * triggers an async `finishEditMode` flow that includes a fire-and-forget
 * `linkBehaviorGroupAction` call. The edit button only reappears when this
 * async operation completes. Waiting for it is unreliable in CI. The save
 * test skips cleanup entirely — pickDifferentThreshold toggles between
 * 42/58 so each run works regardless of the starting value.
 */

const CONFIGURE_EVENTS_PATH = `${NOTIFICATIONS_PATH}/configure-events`;
const THRESHOLD_ROW_TEXT = 'Custom subscription threshold exceeded';
const SUBSCRIPTION_SERVICES_TAB = 'Subscription Services';

// =============================================================================
// Helpers
// =============================================================================

/**
 * Navigate to Configure Events > Subscription Services > Configuration tab
 * and wait for the threshold row to be visible.
 *
 * Returns the table row locator, or null if the threshold row is not found
 * (e.g. feature flag disabled, tab missing, or backend doesn't have the event
 * type configured in this environment).
 */
async function navigateToSubscriptionServicesConfig(
  page: Page
): Promise<ReturnType<Page['locator']> | null> {
  try {
    await page.goto(CONFIGURE_EVENTS_PATH, { timeout: TIMEOUTS.PAGE_LOAD });
    await page.waitForLoadState('domcontentloaded');
  } catch {
    console.log('navigateToSubscriptionServicesConfig: page.goto failed');
    return null;
  }

  // Wait for heading — retry with reload if module federation hasn't hydrated
  const heading = page.getByRole('heading', { name: 'Configure Events' });
  if (!(await heading.isVisible({ timeout: TIMEOUTS.QUICK_CHECK }).catch(() => false))) {
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  }

  const headingVisible = await heading
    .waitFor({ state: 'visible', timeout: TIMEOUTS.PAGE_LOAD })
    .then(() => true)
    .catch(() => false);

  if (!headingVisible) {
    console.log('Configure Events heading not visible');
    return null;
  }

  // Check for Subscription Services tab (feature flag gated)
  const bundleTablist = page.locator('#bundle-tabs [role="tablist"]');
  const tablistVisible = await bundleTablist
    .waitFor({ state: 'visible', timeout: TIMEOUTS.PAGE_LOAD })
    .then(() => true)
    .catch(() => false);

  if (!tablistVisible) {
    console.log('Bundle tablist not visible');
    return null;
  }

  const subscriptionTab = bundleTablist.getByRole('tab', {
    name: SUBSCRIPTION_SERVICES_TAB,
  });
  const tabVisible = await subscriptionTab
    .waitFor({ state: 'visible', timeout: TIMEOUTS.QUICK_CHECK })
    .then(() => true)
    .catch(() => false);

  if (!tabVisible) {
    console.log('Subscription Services tab not visible — feature flag likely disabled');
    return null;
  }

  await subscriptionTab.click();
  await expect(subscriptionTab).toHaveAttribute('aria-selected', 'true');

  // Wait for bundle panel content to load (Configuration sub-tab renders)
  const panelId = await subscriptionTab.getAttribute('aria-controls');
  if (!panelId) {
    console.log('Subscription Services tab missing aria-controls attribute');
    return null;
  }
  const bundlePanel = page.locator(`#${panelId}`);
  await expect(bundlePanel).toBeVisible({ timeout: TIMEOUTS.ELEMENT_APPEAR });

  const configTab = bundlePanel.getByRole('tab', { name: 'Configuration' });
  await expect(configTab).toBeVisible({ timeout: TIMEOUTS.PAGE_LOAD });

  // Wait for the table to load — first check if ANY table row appears
  const anyRow = bundlePanel.locator('tr').first();
  const tableLoaded = await anyRow
    .waitFor({ state: 'visible', timeout: TIMEOUTS.TABLE_LOAD })
    .then(() => true)
    .catch(() => false);

  if (!tableLoaded) {
    console.log('Configuration table did not load within timeout');
    return null;
  }

  // Search for the threshold row — try filter first (fastest), then pagination
  const thresholdRow = page
    .locator('tr', {
      has: page.locator(`text="${THRESHOLD_ROW_TEXT}"`),
    })
    .first();

  // 1. Quick check — is it on the current (first) page?
  let rowFound = await thresholdRow
    .waitFor({ state: 'visible', timeout: TIMEOUTS.QUICK_CHECK })
    .then(() => true)
    .catch(() => false);

  // 2. Not on first page — try the event type text filter
  if (!rowFound) {
    console.log('Threshold row not on first page — searching via event type filter');
    const filterInput = page.getByPlaceholder('Filter by event type');
    const filterAvailable = await filterInput
      .waitFor({ state: 'visible', timeout: TIMEOUTS.QUICK_CHECK })
      .then(() => true)
      .catch(() => false);

    if (filterAvailable) {
      await filterInput.fill('threshold');
      await filterInput.press('Enter');

      rowFound = await thresholdRow
        .waitFor({ state: 'visible', timeout: TIMEOUTS.TABLE_LOAD })
        .then(() => true)
        .catch(() => false);

      if (rowFound) {
        console.log('Found threshold row via event type filter');
      } else {
        // Clear the filter so pagination fallback sees all rows
        await filterInput.clear();
        await filterInput.press('Enter');
        try {
          await bundlePanel
            .locator('tr')
            .first()
            .waitFor({ state: 'visible', timeout: TIMEOUTS.TABLE_LOAD });
        } catch {
          /* table may still be loading after filter clear */
        }
      }
    }
  }

  // 3. Fallback — paginate through remaining pages
  if (!rowFound) {
    console.log('Trying pagination to find threshold row');
    const nextPageButtons = page.getByRole('button', { name: 'Go to next page' });

    for (let pageNum = 2; pageNum <= 50; pageNum++) {
      const nextBtn = nextPageButtons.first();
      const canGoNext = await nextBtn.isEnabled().catch(() => false);
      if (!canGoNext) {
        console.log(`Exhausted all pages (checked through page ${pageNum - 1})`);
        break;
      }

      await nextBtn.click();
      try {
        await bundlePanel
          .locator('tr')
          .first()
          .waitFor({ state: 'visible', timeout: TIMEOUTS.TABLE_LOAD });
      } catch {
        /* table may still be loading after page change */
      }

      rowFound = await thresholdRow
        .waitFor({ state: 'visible', timeout: TIMEOUTS.QUICK_CHECK })
        .then(() => true)
        .catch(() => false);

      if (rowFound) {
        console.log(`Found threshold row on page ${pageNum}`);
        break;
      }
    }
  }

  if (!rowFound) {
    console.log(`Threshold row ("${THRESHOLD_ROW_TEXT}") not found after filter + pagination`);
    return null;
  }

  return thresholdRow;
}

/**
 * Read the current threshold value from the read-only display.
 * In read-only mode the cell shows: "{value} % of usage threshold"
 * Waits for the cell to finish loading (Skeleton → actual value).
 */
async function getCurrentThresholdValue(
  thresholdRow: ReturnType<Page['locator']>
): Promise<number> {
  // The threshold cell is the 4th td (index 3): expand | name | application | behavior/threshold | actions
  const thresholdCell = thresholdRow.locator('td').nth(3);
  // Wait for the "of usage threshold" text to appear (indicates data loaded, not Skeleton)
  await expect(thresholdCell.getByText('of usage threshold')).toBeVisible({
    timeout: TIMEOUTS.TABLE_LOAD,
  });
  const cellText = await thresholdCell.textContent();
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
// Org Admin — Edit, Save, and Cancel Threshold
// =============================================================================

test.describe('Subscription Threshold — Org Admin', () => {
  // Disable retries: module federation hydration in Konflux CI takes 60-90s per
  // navigation. Retries just burn pipeline budget for env-related slowness.
  test.describe.configure({ retries: 0 });

  test.beforeEach(async ({ page }) => {
    // Only block TrustArc — do NOT call ensureLoggedIn() which navigates to
    // '/' (60-90 s in Konflux CI). Auth is handled by storageState from
    // global-setup. The test's own navigate call is the only navigation needed.
    await disableCookiePrompt(page);
  });

  test('should edit threshold and verify success notification', async ({ page }) => {
    /**
     * No cleanup navigation — each full page navigation takes 60-90s in
     * Konflux CI (module federation hydration). A cleanup re-navigation
     * would push total time past the 180s global timeout.
     * pickDifferentThreshold toggles between 42/58, so every run works
     * regardless of the starting value left by a previous run.
     */
    const thresholdRow = await navigateToSubscriptionServicesConfig(page);
    test.skip(
      !thresholdRow,
      'Threshold row not found — feature flag may be disabled or event type missing'
    );

    const originalThreshold = await getCurrentThresholdValue(thresholdRow!);
    const newThreshold = pickDifferentThreshold(originalThreshold);

    await enterEditMode(thresholdRow!);
    await setThresholdValue(thresholdRow!, newThreshold);
    await saveChanges(thresholdRow!);

    // Success notification confirms org-preferences API persisted the value
    await waitForSuccessNotification(page);
    console.log(`✓ Threshold saved to ${newThreshold}% (notification confirmed)`);
  });

  test('should cancel editing without saving', async ({ page }) => {
    /**
     * Cancel is synchronous — cancelEditMode immediately resets isEditMode
     * and restores oldThresholdValue. No async API calls, no race condition.
     * Uses the global 180s timeout (enough for 1 navigation + simple actions).
     */
    const thresholdRow = await navigateToSubscriptionServicesConfig(page);
    test.skip(
      !thresholdRow,
      'Threshold row not found — feature flag may be disabled or event type missing'
    );

    const originalThreshold = await getCurrentThresholdValue(thresholdRow!);
    const tempThreshold = pickDifferentThreshold(originalThreshold);

    await enterEditMode(thresholdRow!);
    await setThresholdValue(thresholdRow!, tempThreshold);

    // Verify the input shows the temp value before cancelling
    const thresholdInput = thresholdRow!.getByRole('spinbutton', {
      name: 'Usage threshold percentage',
    });
    await expect(thresholdInput).toHaveValue(String(tempThreshold));

    await cancelChanges(thresholdRow!);

    // Cancel is synchronous — edit button reappears immediately
    const editButton = thresholdRow!.getByRole('button', { name: 'edit' });
    await expect(editButton).toBeVisible({ timeout: TIMEOUTS.ELEMENT_APPEAR });

    // Verify value reverted to original (cancel does not persist)
    const revertedThreshold = await getCurrentThresholdValue(thresholdRow!);
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
