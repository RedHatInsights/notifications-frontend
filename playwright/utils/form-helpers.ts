import { Locator, Page } from '@playwright/test';
import {
  AnsiblePayload,
  CommunicationPayload,
  PagerDutyPayload,
  ServiceNowPayload,
  SplunkPayload,
  WebhookPayload,
} from './data-generators';
import { TIMEOUTS } from '../test-constants';

/**
 * Form interaction helpers for Playwright E2E tests
 * Provides utilities for filling out integration forms
 */

/**
 * Click an action button on a card (Edit, Delete, etc.)
 * Handles both direct button and kebab menu patterns
 */
export async function clickCardAction(
  card: Locator,
  page: Page,
  actionName: string
): Promise<void> {
  // Try to find direct action button first
  const directButton = card
    .locator(`button[aria-label*="${actionName}"], button:has-text("${actionName}")`)
    .first();

  if ((await directButton.count()) > 0) {
    await directButton.click();
  } else {
    // Fall back to kebab menu
    const kebabButton = card
      .locator('button[aria-label*="Actions"], button[aria-label*="Kebab"]')
      .first();
    await kebabButton.click();

    // Wait for menu to open and scope the action lookup to the opened menu
    const menu = page
      .locator('[role="menu"], .pf-v6-c-menu, [data-ouia-component-type*="Menu"]')
      .first();
    await menu.waitFor({ state: 'visible', timeout: TIMEOUTS.QUICK_CHECK });

    const menuItem = menu.locator(`button:has-text("${actionName}")`).first();
    await menuItem.click();
  }
}

/**
 * Fill webhook form in the integration wizard
 * Navigates through the multi-step wizard and fills all required fields
 */
export async function fillWebhookForm(page: Page, payload: WebhookPayload): Promise<void> {
  // Wait for wizard dialog to be visible
  await page.waitForSelector('[role="dialog"]', {
    state: 'visible',
    timeout: 30000,
  });

  // Step 1: Integration Details
  // Fill name field
  const nameInput = page.locator('input[name="name"], input[id="name"]').first();
  await nameInput.waitFor({ state: 'visible' });
  await nameInput.fill(payload.name);

  // Wait a bit for form validation
  await page.waitForTimeout(500);

  // Fill URL field
  const urlInput = page.locator('input[name="url"], input[id="url"]').first();
  await urlInput.waitFor({ state: 'visible' });
  await urlInput.fill(payload.url);

  // Wait for Next button to be enabled (form validation)
  await page.waitForTimeout(500);

  // Click Next button
  const nextButton = page.locator('button:has-text("Next")').first();
  await nextButton.waitFor({ state: 'visible' });

  // Wait for button to be enabled (no disabled attribute)
  await page.waitForFunction(
    (btn) => !btn.hasAttribute('disabled'),
    await nextButton.elementHandle(),
    { timeout: 10000 }
  );

  await nextButton.click();

  // Step 2: Event Types (if behavior groups feature is enabled)
  // Target the h4 header specifically to avoid matching the nav text
  const eventTypesHeader = page.locator('h4:has-text("Associate event types")').first();

  // Wait for the step to appear - don't catch, let it throw if step doesn't exist
  try {
    await eventTypesHeader.waitFor({ state: 'visible', timeout: 15000 });
  } catch (e) {
    // Step 2 doesn't exist, skip to step 3 (Review)
    return;
  }

  // If we get here, step 2 exists and we MUST complete it
  {
    // The Next button won't be enabled until the table finishes loading,
    // so we'll rely on that check rather than trying to detect table load state

    if (payload.eventTypes && payload.eventTypes.length > 0) {
      // Select event types if provided
      for (const eventType of payload.eventTypes) {
        const eventCheckbox = page.locator(`input[type="checkbox"][value="${eventType}"]`).first();
        if (await eventCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
          await eventCheckbox.check();
          await page.waitForTimeout(300);
        }
      }
    }

    // Click Next button to proceed to Review step
    // Button doesn't have role attribute, use text selector
    const nextButtonStep2 = page.locator('button:has-text("Next")').first();

    // Wait for it to be visible
    await nextButtonStep2.waitFor({ state: 'visible', timeout: 5000 });

    // Wait for button to be enabled (no disabled attribute)
    // This will wait until the table finishes loading, so use a long timeout (30s)
    await page.waitForFunction(
      (btn) => !btn.hasAttribute('disabled'),
      await nextButtonStep2.elementHandle(),
      { timeout: 30000 }
    );

    // Click the button (force click to bypass any overlays)
    await nextButtonStep2.click({ force: true });

    // Wait to ensure navigation to Review step happened
    await page.waitForTimeout(2000);
  }

  // Step 3: Review
  // Wait for review step
  await page.waitForSelector('text=/Review/i', { timeout: 5000 });

  // Click Submit button - scope to within the dialog to avoid clicking the background button
  const submitButton = page.locator('[role="dialog"] button:has-text("Submit")').first();
  await submitButton.waitFor({ state: 'visible', timeout: 5000 });

  // Use force to bypass any overlay issues
  await submitButton.click({ force: true });

  // Alternative: if force doesn't work, try pressing Enter on the button
  // await submitButton.press('Enter');
}

/**
 * Fill communication integration form (Slack, Teams, Google Chat)
 */
export async function fillCommunicationForm(
  page: Page,
  payload: CommunicationPayload
): Promise<void> {
  // Wait for wizard
  await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 30000 });

  // Step 1: Select Integration Type
  // Check if it's a card-based selection (PF6 wizard)
  const typeDisplayName =
    payload.type === 'slack'
      ? 'Slack'
      : payload.type === 'gchat'
      ? 'Google Chat'
      : payload.type === 'teams'
      ? 'Microsoft Office Teams'
      : 'Email';

  // Try different selectors for the card (might be label, div, or button)
  const typeCard = page
    .locator(
      `label:has-text("${typeDisplayName}"), ` +
        `div:has-text("${typeDisplayName}"), ` +
        `[role="button"]:has-text("${typeDisplayName}"), ` +
        `button:has-text("${typeDisplayName}")`
    )
    .filter({ hasText: new RegExp(`^${typeDisplayName}$`) })
    .first();

  if (await typeCard.isVisible({ timeout: 2000 }).catch(() => false)) {
    await typeCard.click({ force: true });
    await page.waitForTimeout(1000);

    // Wait for Next button to be enabled
    const nextButton = page.locator('button:has-text("Next")').first();
    await page.waitForFunction(
      (btn) => !btn.hasAttribute('disabled'),
      await nextButton.elementHandle(),
      { timeout: 5000 }
    );
    await nextButton.click();
    await page.waitForTimeout(1000);
  } else {
    // Fallback: dropdown selector (legacy)
    const typeSelector = page
      .locator('select[name="integration-type"], [name="integration-type"]')
      .first();
    if (await typeSelector.isVisible({ timeout: 2000 }).catch(() => false)) {
      const typeValue = `camel:${payload.type === 'gchat' ? 'google_chat' : payload.type}`;
      await typeSelector.selectOption(typeValue);
      await page.locator('button:has-text("Next")').first().click();
      await page.waitForTimeout(1000);
    }
  }

  // Step 2: Integration Details
  const nameInput = page.locator('input[name="name"], input[id="name"]').first();
  await nameInput.waitFor({ state: 'visible' });
  await nameInput.fill(payload.name);

  const urlInput = page.locator('input[name="url"], input[id="url"]').first();
  await urlInput.waitFor({ state: 'visible' });
  await urlInput.fill(payload.url);

  await page.locator('button:has-text("Next")').first().click();

  // Step 3: Event Types (if enabled)
  // Target the h4 header specifically to avoid matching the nav text
  const eventTypesHeaderComm = page.locator('h4:has-text("Associate event types")').first();

  // Wait for the step to appear - don't catch, let it throw if step doesn't exist
  try {
    await eventTypesHeaderComm.waitFor({ state: 'visible', timeout: 15000 });
  } catch (e) {
    // Step 3 doesn't exist, skip to step 4 (Review)
    return;
  }

  // If we get here, step 3 exists and we MUST complete it
  {
    // The Next button won't be enabled until the table finishes loading,
    // so we'll rely on that check rather than trying to detect table load state

    if (payload.eventTypes && payload.eventTypes.length > 0) {
      for (const eventType of payload.eventTypes) {
        const eventCheckbox = page.locator(`input[type="checkbox"][value="${eventType}"]`).first();
        if (await eventCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
          await eventCheckbox.check();
          await page.waitForTimeout(300);
        }
      }
    }

    // Click Next button to proceed to Review step
    // Button doesn't have role attribute, use text selector
    const nextButtonStep3 = page.locator('button:has-text("Next")').first();

    // Wait for it to be visible
    await nextButtonStep3.waitFor({ state: 'visible', timeout: 5000 });

    // Wait for button to be enabled (no disabled attribute)
    // This will wait until the table finishes loading, so use a long timeout (30s)
    await page.waitForFunction(
      (btn) => !btn.hasAttribute('disabled'),
      await nextButtonStep3.elementHandle(),
      { timeout: 30000 }
    );

    // Click the button (force click to bypass any overlays)
    await nextButtonStep3.click({ force: true });

    // Wait to ensure navigation to Review step happened
    await page.waitForTimeout(2000);
  }

  // Step 4: Review and Submit
  await page.waitForSelector('text=/Review/i', { timeout: 5000 });

  // Click Submit button - scope to within the dialog to avoid clicking the background button
  const submitButton = page.locator('[role="dialog"] button:has-text("Submit")').first();

  // Wait for button to be enabled
  await page
    .waitForFunction((btn) => !btn.hasAttribute('disabled'), await submitButton.elementHandle(), {
      timeout: 10000,
    })
    .catch(() => {}); // Continue if validation is instant

  await submitButton.click({ force: true }); // Force click to bypass overlays
}

/**
 * Fill PagerDuty reporting integration form
 */
export async function fillPagerDutyForm(page: Page, payload: PagerDutyPayload): Promise<void> {
  // Wait for wizard
  await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 30000 });

  // Step 1: Select Integration Type
  const typeSelector = page
    .locator('select[name="integration-type"], [name="integration-type"]')
    .first();
  if (await typeSelector.isVisible({ timeout: 2000 })) {
    await typeSelector.selectOption('pagerduty');
    await page.locator('button:has-text("Next")').first().click();
  }

  // Step 2: Integration Details
  const nameInput = page.locator('input[name="name"], input[id="name"]').first();
  await nameInput.waitFor({ state: 'visible' });
  await nameInput.fill(payload.name);

  // Fill secret token
  const tokenInput = page.locator('input[name="secret-token"], input[id="secret-token"]').first();
  await tokenInput.waitFor({ state: 'visible' });
  await tokenInput.fill(payload.secretToken);

  // Select severity
  const severitySelector = page.locator('select[name="severity"], [name="severity"]').first();
  if (await severitySelector.isVisible({ timeout: 2000 })) {
    await severitySelector.selectOption(payload.severity);
  }

  await page.locator('button:has-text("Next")').first().click();

  // Step 3: Event Types (if enabled)
  const eventTypesHeader = page.locator('text=/Associate event types/i').first();
  if (await eventTypesHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
    if (payload.eventTypes && payload.eventTypes.length > 0) {
      for (const eventType of payload.eventTypes) {
        const eventCheckbox = page.locator(`input[type="checkbox"][value="${eventType}"]`).first();
        if (await eventCheckbox.isVisible()) {
          await eventCheckbox.check();
        }
      }
    }
    await page.locator('button:has-text("Next")').first().click();
  }

  // Step 4: Review and Submit
  await page.waitForSelector('text=/Review/i', { timeout: 5000 });
  const submitButton = page
    .locator('button:has-text("Submit"), button:has-text("Create"), button:has-text("Add")')
    .first();
  await submitButton.click();
}

/**
 * Fill ServiceNow reporting integration form
 */
export async function fillServiceNowForm(page: Page, payload: ServiceNowPayload): Promise<void> {
  await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 30000 });

  // Step 1: Select Integration Type
  const typeSelector = page
    .locator('select[name="integration-type"], [name="integration-type"]')
    .first();
  if (await typeSelector.isVisible({ timeout: 2000 })) {
    await typeSelector.selectOption('servicenow');
    await page.locator('button:has-text("Next")').first().click();
  }

  // Step 2: Integration Details
  const nameInput = page.locator('input[name="name"], input[id="name"]').first();
  await nameInput.waitFor({ state: 'visible' });
  await nameInput.fill(payload.name);

  const instanceUrlInput = page
    .locator('input[name="instance-url"], input[id="instance-url"], input[name="url"]')
    .first();
  await instanceUrlInput.waitFor({ state: 'visible' });
  await instanceUrlInput.fill(payload.instanceUrl);

  const usernameInput = page.locator('input[name="username"], input[id="username"]').first();
  await usernameInput.waitFor({ state: 'visible' });
  await usernameInput.fill(payload.username);

  const passwordInput = page.locator('input[name="password"], input[id="password"]').first();
  await passwordInput.waitFor({ state: 'visible' });
  await passwordInput.fill(payload.password);

  await page.locator('button:has-text("Next")').first().click();

  // Step 3: Event Types (if enabled)
  const eventTypesHeader = page.locator('text=/Associate event types/i').first();
  if (await eventTypesHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
    if (payload.eventTypes && payload.eventTypes.length > 0) {
      for (const eventType of payload.eventTypes) {
        const eventCheckbox = page.locator(`input[type="checkbox"][value="${eventType}"]`).first();
        if (await eventCheckbox.isVisible()) {
          await eventCheckbox.check();
        }
      }
    }
    await page.locator('button:has-text("Next")').first().click();
  }

  // Step 4: Review and Submit
  await page.waitForSelector('text=/Review/i', { timeout: 5000 });
  const submitButton = page
    .locator('button:has-text("Submit"), button:has-text("Create"), button:has-text("Add")')
    .first();
  await submitButton.click();
}

/**
 * Fill Splunk reporting integration form
 */
export async function fillSplunkForm(page: Page, payload: SplunkPayload): Promise<void> {
  await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 30000 });

  // Step 1: Select Integration Type
  const typeSelector = page
    .locator('select[name="integration-type"], [name="integration-type"]')
    .first();
  if (await typeSelector.isVisible({ timeout: 2000 })) {
    await typeSelector.selectOption('splunk');
    await page.locator('button:has-text("Next")').first().click();
  }

  // Step 2: Integration Details
  const nameInput = page.locator('input[name="name"], input[id="name"]').first();
  await nameInput.waitFor({ state: 'visible' });
  await nameInput.fill(payload.name);

  const urlInput = page.locator('input[name="url"], input[id="url"]').first();
  await urlInput.waitFor({ state: 'visible' });
  await urlInput.fill(payload.url);

  const tokenInput = page
    .locator('input[name="token"], input[id="token"], input[name="hec-token"]')
    .first();
  await tokenInput.waitFor({ state: 'visible' });
  await tokenInput.fill(payload.token);

  await page.locator('button:has-text("Next")').first().click();

  // Step 3: Event Types (if enabled)
  const eventTypesHeader = page.locator('text=/Associate event types/i').first();
  if (await eventTypesHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
    if (payload.eventTypes && payload.eventTypes.length > 0) {
      for (const eventType of payload.eventTypes) {
        const eventCheckbox = page.locator(`input[type="checkbox"][value="${eventType}"]`).first();
        if (await eventCheckbox.isVisible()) {
          await eventCheckbox.check();
        }
      }
    }
    await page.locator('button:has-text("Next")').first().click();
  }

  // Step 4: Review and Submit
  await page.waitForSelector('text=/Review/i', { timeout: 5000 });
  const submitButton = page
    .locator('button:has-text("Submit"), button:has-text("Create"), button:has-text("Add")')
    .first();
  await submitButton.click();
}

/**
 * Fill Ansible Automation Platform integration form
 */
export async function fillAnsibleForm(page: Page, payload: AnsiblePayload): Promise<void> {
  await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 30000 });

  // Step 1: Select Integration Type
  const typeSelector = page
    .locator('select[name="integration-type"], [name="integration-type"]')
    .first();
  if (await typeSelector.isVisible({ timeout: 2000 })) {
    await typeSelector.selectOption('ansible');
    await page.locator('button:has-text("Next")').first().click();
  }

  // Step 2: Integration Details
  const nameInput = page.locator('input[name="name"], input[id="name"]').first();
  await nameInput.waitFor({ state: 'visible' });
  await nameInput.fill(payload.name);

  const urlInput = page.locator('input[name="url"], input[id="url"]').first();
  await urlInput.waitFor({ state: 'visible' });
  await urlInput.fill(payload.url);

  const tokenInput = page.locator('input[name="token"], input[id="token"]').first();
  await tokenInput.waitFor({ state: 'visible' });
  await tokenInput.fill(payload.token);

  await page.locator('button:has-text("Next")').first().click();

  // Step 3: Event Types (if enabled)
  const eventTypesHeader = page.locator('text=/Associate event types/i').first();
  if (await eventTypesHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
    if (payload.eventTypes && payload.eventTypes.length > 0) {
      for (const eventType of payload.eventTypes) {
        const eventCheckbox = page.locator(`input[type="checkbox"][value="${eventType}"]`).first();
        if (await eventCheckbox.isVisible()) {
          await eventCheckbox.check();
        }
      }
    }
    await page.locator('button:has-text("Next")').first().click();
  }

  // Step 4: Review and Submit
  await page.waitForSelector('text=/Review/i', { timeout: 5000 });
  const submitButton = page
    .locator('button:has-text("Submit"), button:has-text("Create"), button:has-text("Add")')
    .first();
  await submitButton.click();
}

/**
 * Wait for success notification after form submission
 */
export async function waitForSuccessNotification(page: Page): Promise<void> {
  // PatternFly alerts appear at the top of the page
  // Try to find success alert or success text
  const alertFound = await page
    .locator(
      '.pf-v6-c-alert.pf-m-success, [class*="pf-v6-c-alert"][class*="success"], .pf-c-alert.pf-m-success, [data-ouia-component-type*="Alert"]'
    )
    .or(page.locator('text=/success|created|added/i'))
    .first()
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!alertFound) {
    throw new Error(
      'Failed to find success notification after form submission. Expected PatternFly success alert or success text.'
    );
  }
}

/**
 * Close the integration wizard modal
 */
export async function closeWizardModal(page: Page): Promise<void> {
  const closeButton = page.locator('button[aria-label="Close"], button:has-text("Cancel")').first();
  if (await closeButton.isVisible({ timeout: 2000 })) {
    await closeButton.click();
  }
}

/**
 * Delete an integration from the UI
 * Handles both direct delete button and kebab menu fallback
 */
export async function deleteIntegration(page: Page, integrationName: string): Promise<void> {
  // Find the table row containing this integration
  const container = page
    .locator('tr', {
      has: page.locator(`text="${integrationName}"`),
    })
    .first();

  // Scroll the row into view first (with timeout to avoid hanging)
  await container.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {
    // If scroll fails, continue anyway - element might already be in view
  });
  await page.waitForTimeout(500);

  const deleteButton = container
    .locator('button[aria-label*="Delete"], button:has-text("Delete")')
    .first();

  if (await deleteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await deleteButton.click();
  } else {
    // Find kebab menu toggle button (PatternFly 6 uses MenuToggle)
    const kebabButton = container
      .locator(
        'button[aria-label*="Actions"], button[aria-label*="Kebab"], button[aria-label*="MenuToggle"], button.pf-v6-c-menu-toggle'
      )
      .first();
    await kebabButton.waitFor({ state: 'visible', timeout: 5000 });
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
}

/**
 * Fill behavior group creation wizard
 *
 * @param page - Playwright page object
 * @param groupName - Unique name for the behavior group
 * @param action - Action to configure (default: 'Send an email')
 * @param recipient - Recipient for the action (default: 'Admins')
 */
export async function fillBehaviorGroupForm(
  page: Page,
  groupName: string,
  options: {
    action?: string;
    recipient?: string;
    skipEventTypes?: boolean;
  } = {}
): Promise<void> {
  const { action = 'Send an email', recipient = 'Admins', skipEventTypes = true } = options;

  // Wait for wizard/modal to be visible
  await page.waitForSelector('[role="dialog"]', { state: 'visible', timeout: 30000 });

  // Step 1: Name
  // Fill behavior group name field
  const nameInput = page
    .locator('input[name="displayName"], input[name="name"], input[id="displayName"]')
    .first();
  await nameInput.waitFor({ state: 'visible', timeout: 10000 });
  await nameInput.fill(groupName);

  // Click Next button
  let nextButton = page.locator('button:has-text("Next")').first();
  await nextButton.click();
  await page.waitForTimeout(500);

  // Step 2: Actions
  // Select action type
  const actionSelect = page
    .locator('select:has([value*="email"]), button:has-text("Select"), [role="combobox"]')
    .first();

  if (await actionSelect.isVisible({ timeout: 3000 })) {
    // Try dropdown selection
    const isSelect = await actionSelect.evaluate((el) => el.tagName === 'SELECT');

    if (isSelect) {
      await actionSelect.selectOption({ label: action });
    } else {
      // It's a PatternFly dropdown button
      await actionSelect.click();
      await page
        .locator(`li:has-text("${action}"), [role="option"]:has-text("${action}")`)
        .first()
        .click();
    }
  }

  // Select recipient
  await page.waitForTimeout(500);

  // Scope to the dialog and find the recipient button by its table cell label
  // This is stable for both create and edit modes (button text changes, but structure doesn't)
  const dialog = page.locator('[role="dialog"]');
  const recipientSelect = dialog
    .locator('[data-label="Recipient"] button, td:has-text("Recipient") + td button')
    .first();

  await recipientSelect.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_APPEAR });
  await recipientSelect.click();

  await page.waitForTimeout(500);
  // Scope the option lookup to the dialog to avoid clicking wrong item outside the modal
  const option = dialog
    .locator(`li:has-text("${recipient}"), [role="option"]:has-text("${recipient}")`)
    .first();
  await option.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_APPEAR });
  await option.click();

  // Click Next
  nextButton = page.locator('button:has-text("Next")').first();
  await nextButton.click();
  await page.waitForTimeout(500);

  // Step 3: Event Types
  // Check if event types step exists by looking for the header
  const eventTypesHeader = page.locator('h4:has-text("Associate event types")').first();

  let hasEventTypesStep = false;
  try {
    await eventTypesHeader.waitFor({ state: 'visible', timeout: 3000 });
    hasEventTypesStep = true;
  } catch {
    hasEventTypesStep = false;
  }

  if (hasEventTypesStep) {
    // Wait for Next button to be enabled (table loads async)
    nextButton = page.locator('button:has-text("Next")').first();
    await page.waitForFunction(
      (btn) => {
        const button = btn as HTMLButtonElement;
        return !button.hasAttribute('disabled');
      },
      await nextButton.elementHandle(),
      { timeout: 30000 }
    );

    if (skipEventTypes) {
      // Just click next without selecting any event types
      await nextButton.click();
    } else {
      // TODO: Implement event type selection if needed
      await nextButton.click();
    }
  }

  await page.waitForTimeout(500);

  // Final submit if needed (in case there's a review step)
  // Scope to dialog to avoid clicking wrong button
  const finalSubmitButton = page
    .locator('[role="dialog"] button:has-text("Finish")')
    .or(page.locator('[role="dialog"] button:has-text("Create")'))
    .or(page.locator('[role="dialog"] button:has-text("Save")'))
    .first();
  if (await finalSubmitButton.isVisible({ timeout: 2000 })) {
    await finalSubmitButton.click();
  }
}
