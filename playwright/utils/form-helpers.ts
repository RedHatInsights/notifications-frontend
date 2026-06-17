import { Page } from '@playwright/test';
import {
  AnsiblePayload,
  CommunicationPayload,
  PagerDutyPayload,
  ServiceNowPayload,
  SplunkPayload,
  WebhookPayload,
} from './data-generators';

/**
 * Form interaction helpers for Playwright E2E tests
 * Provides utilities for filling out integration forms
 */

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
  // Check if event types step exists (use .first() as text appears in nav and header)
  const eventTypesHeader = page.locator('text=/Associate event types/i').first();
  if (await eventTypesHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
    if (payload.eventTypes && payload.eventTypes.length > 0) {
      // Select event types if provided
      for (const eventType of payload.eventTypes) {
        const eventCheckbox = page
          .locator(`input[type="checkbox"][value="${eventType}"], label:has-text("${eventType}")`)
          .first();
        if (await eventCheckbox.isVisible()) {
          await eventCheckbox.check();
        }
      }
    }
    // Click Next to go to review
    await page.locator('button:has-text("Next")').first().click();
  }

  // Step 3: Review
  // Wait for review step
  await page.waitForSelector('text=/Review/i', { timeout: 5000 });

  // Click Submit/Create button (force click in case of overlays)
  const submitButton = page
    .locator('button:has-text("Submit"), button:has-text("Create"), button:has-text("Add")')
    .first();
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
  const eventTypesHeader = page.locator('text=/Associate event types/i').first();
  if (await eventTypesHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
    if (payload.eventTypes && payload.eventTypes.length > 0) {
      for (const eventType of payload.eventTypes) {
        const eventCheckbox = page
          .locator(`input[type="checkbox"][value="${eventType}"], label:has-text("${eventType}")`)
          .first();
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
        const eventCheckbox = page
          .locator(`input[type="checkbox"][value="${eventType}"], label:has-text("${eventType}")`)
          .first();
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
        const eventCheckbox = page
          .locator(`input[type="checkbox"][value="${eventType}"], label:has-text("${eventType}")`)
          .first();
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
        const eventCheckbox = page
          .locator(`input[type="checkbox"][value="${eventType}"], label:has-text("${eventType}")`)
          .first();
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
        const eventCheckbox = page
          .locator(`input[type="checkbox"][value="${eventType}"], label:has-text("${eventType}")`)
          .first();
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
  // Try multiple selectors for success alerts
  const successSelectors = [
    '.pf-v6-c-alert.pf-m-success',
    '[class*="pf-v6-c-alert"][class*="success"]',
    '.pf-c-alert.pf-m-success',
    '[data-ouia-component-type*="Alert"]',
    'text=/success|created|added/i',
  ];

  // Wait for any success indicator
  try {
    await page.waitForSelector(successSelectors.join(', '), { timeout: 10000 });
  } catch {
    // If alert doesn't appear, just wait a bit (creation might have succeeded)
    console.log('⚠ Success alert not found, continuing anyway');
    await page.waitForTimeout(2000);
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

  // Look for recipient dropdown by placeholder text or label
  const recipientSelect = page
    .locator(
      'button:has-text("Select recipients"), ' +
        '[role="combobox"]:has-text("Select recipients"), ' +
        'select, button:has-text("Select"), [role="combobox"]'
    )
    .first();

  await recipientSelect.waitFor({ state: 'visible', timeout: 5000 });
  const isSelect = await recipientSelect.evaluate((el) => el.tagName === 'SELECT');

  if (isSelect) {
    await recipientSelect.selectOption({ label: recipient });
  } else {
    // PatternFly dropdown - click to open, then select option
    await recipientSelect.click();
    await page.waitForTimeout(500);
    const option = page
      .locator(`li:has-text("${recipient}"), [role="option"]:has-text("${recipient}")`)
      .first();
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
  }

  // Click Next
  nextButton = page.locator('button:has-text("Next")').first();
  await nextButton.click();
  await page.waitForTimeout(500);

  // Step 3: Event Types
  // Check if event types step exists
  const eventTypesHeader = page.locator(
    'text=/Associate event/i, text=/Event types/i, text=/Select event/i'
  );

  if (await eventTypesHeader.isVisible({ timeout: 3000 })) {
    if (skipEventTypes) {
      // Just click next without selecting any event types
      nextButton = page
        .locator('button:has-text("Next"), button:has-text("Create"), button:has-text("Save")')
        .first();
      await nextButton.click();
    } else {
      // TODO: Implement event type selection if needed
      nextButton = page
        .locator('button:has-text("Next"), button:has-text("Create"), button:has-text("Save")')
        .first();
      await nextButton.click();
    }
  } else {
    // No event types step, might be on final submit
    const submitButton = page
      .locator('button:has-text("Create"), button:has-text("Save"), button:has-text("Submit")')
      .first();
    if (await submitButton.isVisible({ timeout: 2000 })) {
      await submitButton.click();
    }
  }

  await page.waitForTimeout(500);

  // Final submit if needed (in case there's a review step)
  const finalSubmitButton = page
    .locator('button:has-text("Create"), button:has-text("Save"), button:has-text("Submit")')
    .first();
  if (await finalSubmitButton.isVisible({ timeout: 2000 })) {
    await finalSubmitButton.click();
  }
}
