# Playwright Test Analysis - Best Practices Review

## Issues Found and Recommendations

### 🔴 Critical Issues

#### 1. **Use of `force: true` on clicks**

**Location:**

- `integrations-ui.spec.ts:147` - `await webhooksTab.click({ force: true });`
- `integrations-ui.spec.ts:235` - `await communicationsTab.click({ force: true });`
- `notifications-ui.spec.ts:154` - `await confirmButton.click({ force: true });`

**Problem:** `force: true` bypasses Playwright's actionability checks (visible, stable, enabled, not obscured). This masks real UI issues and can cause flaky tests.

**Why it's bad:**

- If an element is obscured by a modal/overlay, that's a bug - not something to bypass
- Bypasses waiting for animations/transitions to complete
- Can click elements that real users can't click

**Fix:** Remove `force: true` and wait for the element to be properly actionable:

```typescript
// Instead of:
await webhooksTab.click({ force: true });

// Do:
await webhooksTab.click();
// Playwright auto-waits for actionability
```

If clicks are timing out without `force: true`, investigate and fix the root cause (overlays, animations, etc).

---

#### 2. **Silent error swallowing with `.catch(() => {})`**

**Location:**

- `integrations-ui.spec.ts:139` - `.catch(() => page.waitForTimeout(3000))`
- `integrations-ui.spec.ts:143` - `.catch(() => {})`
- `integrations-ui.spec.ts:225` - `.catch(() => page.waitForTimeout(3000))`
- `integrations-ui.spec.ts:229` - `.catch(() => {})`

**Problem:** Silently swallowing errors makes debugging failures much harder. When a test fails, you won't know why.

**Fix:** Either handle the error properly or let it fail:

```typescript
// Instead of:
await page
  .locator('.backdrop')
  .waitFor({ state: 'detached' })
  .catch(() => {});

// Do:
const backdrop = page.locator('.backdrop');
if ((await backdrop.count()) > 0) {
  await backdrop.waitFor({ state: 'detached', timeout: 5000 });
}
```

---

#### 3. **Overuse of `.first()` instead of specific selectors**

**Location:** Throughout both files

**Problem:** `.first()` is fragile - if the DOM order changes or a new element is added, your test breaks. It also hides which specific element you're targeting.

**Examples:**

- `page.locator('button:has-text("Communications")').first()` - Which Communications button?
- `page.locator('text="..."').first()` - Which instance of this text?

**Fix:** Use more specific selectors:

```typescript
// Instead of:
const createButton = page.getByRole('button', { name: 'Create Integration' }).first();

// Do:
const createButton = page.getByRole('button', { name: 'Create Integration', exact: true });
// Or scope to a specific container:
const createButton = page.locator('header').getByRole('button', { name: 'Create Integration' });
```

---

### 🟡 Medium Priority Issues

#### 4. **Duplicate locator definitions**

**Location:** Navigation test - same locator defined multiple times

```typescript
// Bad - defined 3 times in the same test
const communicationsTab = page.locator('button:has-text("Communications")').first();
// ... later in the same test
const reportingTab = page.locator('button:has-text("Reporting")').first();
const webhooksTab = page.locator('button:has-text("Webhooks")').first();
```

**Problem:** Copy-paste errors, harder to maintain

**Fix:** Extract to a helper function:

```typescript
const getTab = (name: string) =>
  page.getByRole('tab', { name }).or(page.getByRole('button', { name }));

await getTab('Communications').click();
await expect(getTab('Communications')).toHaveAttribute('aria-selected', 'true');
```

---

#### 5. **Using `text=` locators instead of semantic roles**

**Location:** Multiple places using `text="${name}"`

**Problem:**

- Not accessible-first (doesn't test how screen readers interact)
- Fragile to text changes (i18n, wording updates)
- Can match unintended elements

**Fix:** Use roles, labels, or test IDs:

```typescript
// Instead of:
const webhookElement = page.locator(`text="${webhookPayload.name}"`).first();

// Do (if it's a heading):
const webhookElement = page.getByRole('heading', { name: webhookPayload.name });

// Or (if it's a table row):
const webhookRow = page.getByRole('row', { name: new RegExp(webhookPayload.name) });
```

---

#### 6. **Manual retry logic instead of Playwright's built-in retries**

**Location:** Page load retry logic in both test files

```typescript
await page
  .getByRole('heading', { name: 'Integrations' })
  .waitFor({ state: 'visible', timeout: 30000 })
  .catch(async () => {
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    return page
      .getByRole('heading', { name: 'Integrations' })
      .waitFor({ state: 'visible', timeout: 30000 });
  });
```

**Problem:** Complex, hard to read, and reinvents Playwright's auto-retry

**Fix:** Use `expect` with auto-retry:

```typescript
// Playwright will automatically retry this assertion
await expect(page.getByRole('heading', { name: 'Integrations' })).toBeVisible({ timeout: 30000 });

// If page genuinely needs reload, make it explicit:
if (!(await page.getByRole('heading', { name: 'Integrations' }).isVisible({ timeout: 5000 }))) {
  await page.reload();
}
await expect(page.getByRole('heading', { name: 'Integrations' })).toBeVisible();
```

---

#### 7. **Conditional logic based on `.isVisible().catch(() => false)`**

**Location:**

- `notifications-ui.spec.ts:49` - Configure Events link
- `notifications-ui.spec.ts:85` - Cookie consent
- `notifications-ui.spec.ts:134` - Delete button

**Problem:** `.isVisible().catch(() => false)` is an anti-pattern that swallows errors

**Fix:** Use Playwright's built-in conditional waits:

```typescript
// Instead of:
if (await acceptCookies.isVisible({ timeout: 2000 }).catch(() => false)) {
  await acceptCookies.click();
}

// Do:
const acceptCookies = page.getByRole('button', { name: 'Accept all' });
if ((await acceptCookies.count()) > 0) {
  await acceptCookies.click();
}

// Or even better - extract to helper (already have dismissCookieConsent):
await dismissCookieConsent(page);
```

---

### 🟢 Minor Issues / Improvements

#### 8. **Inconsistent waiting patterns**

- Some places use `waitForLoadState('domcontentloaded')`
- Some use `waitFor({ state: 'visible' })`
- Some use `expect().toBeVisible()`

**Fix:** Standardize on `expect()` for assertions:

```typescript
// For navigation:
await page.goto(url);
await expect(page).toHaveURL(/expected-pattern/);

// For elements appearing:
await expect(element).toBeVisible();

// Only use explicit waits for non-standard cases
```

---

#### 9. **Magic numbers in timeouts**

Various timeouts: 2000, 3000, 5000, 10000, 15000, 30000ms

**Problem:** No explanation for why different timeouts are used

**Fix:** Extract to named constants with explanations:

```typescript
const TIMEOUTS = {
  PAGE_LOAD: 30000, // Module federation apps can be slow to hydrate
  MODAL_CLOSE: 15000, // Wizard submit + API call + modal animation
  ELEMENT_APPEAR: 5000, // Standard UI element render time
  QUICK_CHECK: 2000, // Fast optional element checks
} as const;

await element.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_APPEAR });
```

---

#### 10. **Test data cleanup**

Currently tests create integrations/behavior groups but rely on deletion in the same test.

**Problem:** If the test fails mid-way, orphaned data accumulates

**Recommendation:** Consider using test.afterEach for cleanup:

```typescript
test.describe('Webhook Integration Lifecycle', () => {
  let createdWebhookName: string | null = null;

  test.afterEach(async ({ page }) => {
    if (createdWebhookName) {
      // Cleanup: delete the webhook even if test failed
      await deleteIntegration(page, createdWebhookName).catch(() => {
        // Cleanup failure is ok - don't fail the test
      });
    }
  });

  test('should create webhook', async ({ page }) => {
    const webhook = generateWebhookPayload();
    createdWebhookName = webhook.name;
    // ... test
  });
});
```

---

## Recommended Refactors

### A. Extract page objects for common patterns

```typescript
// pages/integrations-page.ts
export class IntegrationsPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(INTEGRATIONS_PATH);
    await expect(this.page).toHaveURL(/settings\/integrations/);
  }

  async openCreateWizard(category: 'Webhooks' | 'Communications') {
    await this.page.getByRole('button', { name: 'Create Integration' }).click();
    await this.page.getByRole('menuitem', { name: category }).click();
    await expect(this.page.locator('[role="dialog"]')).toBeVisible();
  }

  async navigateToTab(tabName: string) {
    const tab = this.page.getByRole('tab', { name: tabName });
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  }

  async getIntegrationByName(name: string) {
    return this.page.getByRole('row', { name: new RegExp(name) });
  }
}

// Usage in test:
const integrationsPage = new IntegrationsPage(page);
await integrationsPage.navigate();
await integrationsPage.openCreateWizard('Webhooks');
```

### B. Reduce helper function complexity

`fillWebhookForm` and `fillCommunicationForm` are doing too much:

- Multiple wizard steps
- Complex conditional logic
- Hard to debug when they fail

**Better:** Break into smaller, testable pieces:

```typescript
export async function fillWizardStep1(page: Page, data: { name: string; url: string }) {
  await page.getByLabel('Name').fill(data.name);
  await page.getByLabel('URL').fill(data.url);
  await page.getByRole('button', { name: 'Next' }).click();
}

export async function fillWizardStep2EventTypes(page: Page, eventTypes: string[]) {
  for (const eventType of eventTypes) {
    await page.getByLabel(eventType).check();
  }
  await page.getByRole('button', { name: 'Next' }).click();
}

// In test - explicit steps are easier to debug:
await fillWizardStep1(page, { name: 'My Webhook', url: 'https://...' });
await fillWizardStep2EventTypes(page, ['New recommendation']);
await page.getByRole('button', { name: 'Submit' }).click();
```

---

## Priority Fixes

### High Priority (Do First):

1. ✅ Remove all `force: true` from clicks
2. ✅ Replace `.catch(() => {})` with proper error handling
3. ✅ Fix `.first()` overuse - use specific selectors

### Medium Priority:

4. Replace `text=` locators with semantic roles
5. Standardize waiting patterns
6. Add test cleanup in afterEach

### Low Priority (Nice to Have):

7. Extract page objects
8. Named timeout constants
9. Break up large helper functions

---

## Example: Refactored Webhook Test

```typescript
test('should create, verify, and delete webhook integration', async ({ page }) => {
  const webhook = generateWebhookPayload({ eventTypes: ['New recommendation'] });

  // Step 1: Navigate
  await page.goto(INTEGRATIONS_PATH);
  await expect(page).toHaveURL(/settings\/integrations/);
  await expect(page.getByRole('heading', { name: 'Integrations' })).toBeVisible();

  // Step 2: Open wizard
  await page.getByRole('button', { name: 'Create Integration' }).click();
  await page.getByRole('menuitem', { name: 'Webhooks' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  // Step 3: Fill wizard
  await fillWebhookForm(page, webhook);

  // Step 4: Wait for modal to close
  await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 15000 });

  // Step 5: Navigate to Webhooks tab
  const webhooksTab = page.getByRole('tab', { name: 'Webhooks' });
  await webhooksTab.click();
  await expect(webhooksTab).toHaveAttribute('aria-selected', 'true');

  // Step 6: Verify webhook appears
  const webhookRow = page.getByRole('row', { name: new RegExp(webhook.name) });
  await expect(webhookRow).toBeVisible({ timeout: 15000 });

  // Step 7: Delete webhook
  await deleteIntegration(page, webhook.name);

  // Step 8: Verify deletion
  await expect(webhookRow).not.toBeVisible({ timeout: 10000 });
});
```

Key improvements:

- No `force: true`
- No `.catch(() => {})`
- Semantic selectors (`getByRole`)
- Clear step-by-step flow
- Proper `expect()` assertions with auto-retry
