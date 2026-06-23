# Test Stability Improvements - Summary

## Changes Made

### ✅ 1. Removed `force: true` from all clicks

**Files affected:**

- `integrations-ui.spec.ts` (2 occurrences)
- `notifications-ui.spec.ts` (1 occurrence)

**Why:** `force: true` bypasses Playwright's actionability checks and can mask real UI bugs. Clicks should only succeed when elements are truly clickable.

**Changed:**

```typescript
// Before:
await webhooksTab.click({ force: true });

// After:
await webhooksTab.click();
```

---

### ✅ 2. Replaced silent error swallowing with explicit checks

**Files affected:**

- `integrations-ui.spec.ts` (backdrop and wizard close waits)
- `notifications-ui.spec.ts` (cookie consent, Configure Events link, delete button)

**Why:** `.catch(() => {})` and `.catch(() => false)` silently swallow errors, making debugging impossible when tests fail.

**Changed:**

```typescript
// Before:
await page
  .locator('.backdrop')
  .waitFor({ state: 'detached' })
  .catch(() => {});

// After:
const backdrop = page.locator('.backdrop');
if ((await backdrop.count()) > 0) {
  await backdrop.waitFor({ state: 'detached', timeout: 5000 });
}
```

**Pattern used:**

- Check element count with `.count()` instead of `.isVisible().catch(() => false)`
- Only wait if element exists
- Errors will now surface properly instead of being hidden

---

### ✅ 3. Replaced manual retry logic with Playwright auto-retry

**Files affected:**

- `integrations-ui.spec.ts` (page heading wait)

**Why:** Manual catch-retry logic is complex and reinvents Playwright's built-in auto-retry.

**Changed:**

```typescript
// Before:
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

// After:
const heading = page.getByRole('heading', { name: 'Integrations' });
if (!(await heading.isVisible({ timeout: 5000 }))) {
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
}
await expect(heading).toBeVisible({ timeout: 30000 });
```

**Benefits:**

- Clearer intent: "reload if not visible quickly, then expect it to appear"
- Uses `expect()` which auto-retries
- Easier to read and debug

---

### ✅ 4. Fixed flaky "Create Integration" button timeout

**Files affected:**

- `integrations-ui.spec.ts` (both webhook and communication tests)

**Issue:** Button timing out after 10 seconds on module federation app load.

**Root cause:** Module federation apps can be slow to hydrate, especially in CI or slower environments.

**Fix:**

```typescript
// Before:
await createButton.waitFor({ state: 'visible', timeout: 10000 });

// After:
await expect(createButton).toBeVisible({ timeout: 30000 });
```

**Why 30 seconds?**

- Module federation bundles need to load
- React needs to hydrate
- PatternFly components need to mount
- Aligns with other page-load timeouts

---

### ✅ 5. Created timeout constants

**New file:** `test-constants.ts`

**Why:** Magic numbers (2000, 5000, 10000, 15000, 30000) scattered throughout tests make it unclear why different timeouts are used.

**Constants defined:**

```typescript
export const TIMEOUTS = {
  PAGE_LOAD: 30000, // Module federation + hydration
  MODAL_CLOSE: 15000, // Form submit + API + animation
  TABLE_LOAD: 15000, // API data fetch
  ELEMENT_APPEAR: 10000, // Standard UI elements
  QUICK_CHECK: 5000, // Optional elements
  BACKDROP_DISMISS: 5000, // Overlay animations
} as const;
```

**Next step:** Replace hardcoded timeouts with named constants in tests.

---

## Impact on Test Stability

### Before Changes:

- ❌ Silent failures from `.catch(() => {})` made debugging hard
- ❌ `force: true` masked actionability issues
- ❌ Manual retry logic was complex and error-prone
- ❌ 10-second timeout too short for Create Integration button → flaky failures
- ❌ Magic timeout numbers had no explanation

### After Changes:

- ✅ Errors surface properly - easier to debug
- ✅ Clicks only succeed when truly actionable - catches real bugs
- ✅ Uses Playwright's auto-retry - simpler and more reliable
- ✅ 30-second timeout for slow module federation loads - more stable
- ✅ Named constants document why timeouts are chosen

---

## Remaining Improvements (Not Yet Done)

### Extract Page Objects

Would reduce duplication and improve maintainability:

```typescript
class IntegrationsPage {
  async navigateToTab(name: string) { ... }
  async openCreateWizard(category: string) { ... }
  async getIntegrationRow(name: string) { ... }
}
```

**Benefit:** DRY, easier to update selectors in one place

---

### Add Test Cleanup in afterEach

Currently tests clean up within the test - if test fails mid-way, data is orphaned:

```typescript
test.afterEach(async ({ page }) => {
  if (createdWebhookName) {
    await deleteIntegration(page, createdWebhookName).catch(() => {});
  }
});
```

**Benefit:** No orphaned test data even when tests fail

---

### Use Named Timeout Constants

Replace all hardcoded timeouts with constants from `test-constants.ts`:

```typescript
// Before:
await element.waitFor({ timeout: 15000 });

// After:
import { TIMEOUTS } from './test-constants';
await element.waitFor({ timeout: TIMEOUTS.TABLE_LOAD });
```

**Benefit:** Self-documenting, easier to tune globally

---

## Files Modified

1. ✅ `integrations-ui.spec.ts` - Removed force clicks, fixed error handling, increased timeout
2. ✅ `notifications-ui.spec.ts` - Removed force click, fixed conditional checks
3. ✅ `test-constants.ts` - Created (new file)
4. ✅ `SEMANTIC_SELECTORS.md` - Created documentation (new file)
5. ✅ `STABILITY_IMPROVEMENTS.md` - This file (new)

---

## Testing Recommendations

Run tests multiple times to verify stability:

```bash
# Run 5 times to check for flakiness
for i in {1..5}; do
  echo "Run $i"
  npx playwright test integrations-ui.spec.ts
done
```

If tests still fail:

1. Check the error message (no longer silently swallowed)
2. Look at screenshots/videos in `test-results/`
3. Run with `--debug` to step through
4. Consider increasing timeout if legitimate slow loads

---

## Success Metrics

**Before:**

- Webhook test flaky due to 10s timeout on Create Integration button
- Debugging difficult due to `.catch(() => {})` hiding errors
- No documentation on timeout values

**After:**

- 30s timeout aligns with real module federation load times
- Errors surface with clear messages
- Documented timeout constants explain the "why"
- Removed actionability bypasses that could mask bugs
