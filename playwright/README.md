# Playwright E2E Tests - Notifications Frontend

This directory contains **pure UI E2E tests** for the notifications frontend.

These tests follow the **user journey pattern**: create via UI → verify in UI → delete via UI. No API backdoors or verification - just testing what users actually do.

## Test Files

### 📋 `integrations-ui.spec.ts`

All integration-related tests (navigation + creation/deletion workflows)

### 📋 `notifications-ui.spec.ts`

All notification-related tests (bundle navigation + behavior groups + events log)

## Test Coverage

### Integrations Feature Area (`integrations-ui.spec.ts`)

**Test Suite:** Integration Navigation (1 test)

- Navigates across Communications, Reporting, and Webhooks tabs
- Verifies each tab loads successfully
- ✅ **Status: PASSING**

**Test Suite:** Webhook Integration Lifecycle (1 test)

- Creates webhook via UI wizard (Create Integration → Webhooks)
- Fills form fields (name, URL)
- Handles event types step
- Verifies webhook appears in UI
- Deletes webhook via UI
- ✅ **Status: PASSING** - Full create → verify → delete cycle

**Test Suite:** Communication Integration Lifecycle (1 test)

- Creates Slack integration via UI wizard
- Fills communication form
- Verifies integration in UI
- Deletes integration via UI
- ⏳ **Status: IN PROGRESS** - Being finalized

### Notifications Feature Area (`notifications-ui.spec.ts`)

**Test Suite:** Notifications Bundle Navigation (2 tests)

- Tests navigation to each bundle (RHEL, Console, OpenShift, Ansible)
- Tests navigation to Configure Events for each bundle
- Verifies pages load successfully
- ✅ **Status: PASSING** - Both tests pass

**Test Suite:** Behavior Group Lifecycle (1 test)

- Creates behavior group via UI wizard
- Fills form (name, action, recipient)
- Verifies behavior group appears in card display
- Deletes behavior group via UI
- ⏳ **Status: IN PROGRESS** - Full create → verify → delete cycle

**Test Suite:** Events Log (1 test)

- Tests navigation to Events Log page
- Verifies page loads without errors
- ✅ **Status: PASSING**

## Test Philosophy

These are **pure UI E2E tests** that follow the user journey:

✅ **What we test:**

- UI navigation works
- Forms can be filled and submitted
- Created items appear in the UI
- Items can be deleted via UI

❌ **What we don't test:**

- API response formats (that's integration testing)
- Backend data validation (that's unit/API testing)
- Exact data matching between API and UI (prone to flakiness)

This approach makes tests:

- **Simpler** - No API utilities, no authentication complexity
- **More robust** - Tests what users actually do
- **More maintainable** - Less coupling to API contracts
- **Better E2E coverage** - Validates full user workflows

## Utilities

### Data Generators (`utils/data-generators.ts`)

Generate unique test data with timestamp-based naming:

- `generateIntegrationName(type)` - Format: `PW_INT_{timestamp}_{type}_{random}`
- `generateBehaviorGroupName(bundle?)` - Format: `PW_BG_{timestamp}_{bundle}_{random}`
- `generateWebhookPayload(options)` - Complete webhook payload
- `generateCommunicationPayload(type, options)` - Slack/Teams/GChat payload
- `generatePagerDutyPayload(options)` - PagerDuty payload with severity

### Form Helpers (`utils/form-helpers.ts`)

Multi-step wizard interaction helpers:

- `fillWebhookForm(page, payload)` - Navigate webhook creation wizard
- `fillCommunicationForm(page, payload)` - Navigate communication wizard
- `fillPagerDutyForm(page, payload)` - Navigate PagerDuty wizard
- `fillBehaviorGroupForm(page, groupName, options)` - Navigate BG wizard
- `waitForSuccessNotification(page)` - Wait for PatternFly success alert
- `closeWizardModal(page)` - Close modal/wizard

## Running Tests

Tests run against a **local development proxy** (`https://stage.foo.redhat.com:1337`) that proxies to Red Hat stage.

Authentication is handled automatically by a custom global setup (based on the learning-resources pattern) that saves session state.

### Quick Start

```bash
# Terminal 1: Start local dev server
npm start

# Terminal 2: Set credentials and run tests
export E2E_USER="your-redhat-username"
export E2E_PASSWORD="your-redhat-password"
npx playwright test integrations-ui.spec.ts notifications-ui.spec.ts
```

**Note:** Global setup runs once at the start and saves authentication state to `playwright/.auth/user.json`. All tests reuse this session.

### 📖 Detailed Instructions

See **[RUNNING_TESTS.md](./RUNNING_TESTS.md)** for complete setup instructions, including:

- `/etc/hosts` configuration
- Environment variable setup
- Troubleshooting common issues
- Running against real stage environment
- CI/CD integration

### Quick Commands

```bash
# Run all UI tests
npx playwright test integrations-ui.spec.ts notifications-ui.spec.ts

# Run only integration tests
npx playwright test integrations-ui.spec.ts

# Run only notification tests
npx playwright test notifications-ui.spec.ts

# Run specific test by name
npx playwright test --grep "Webhook"

# Interactive UI mode (recommended for debugging)
npx playwright test --ui

# Run with visible browser
npx playwright test --headed

# Clear saved authentication and re-login
rm -rf playwright/.auth && npx playwright test
```

### CI/CD

Tests are configured for Konflux CI:

- Serial execution (no parallel)
- 180s timeout per test
- 2 retries on failure
- Chromium only

## Test Patterns

### API + UI Verification

All creation tests follow this pattern:

1. Generate unique test data
2. Create resource via UI wizard
3. Verify via API (check properties)
4. Verify in UI table/cards
5. Cleanup in `finally` block

Example:

```typescript
let createdId: string | undefined;

try {
  const payload = generateWebhookPayload();
  await fillWebhookForm(page, payload);
  await waitForSuccessNotification(page);

  const apiResponse = await fetchIntegrations(request, { name: payload.name });
  expect(apiResponse.data.length).toBe(1);

  createdId = apiResponse.data[0].id;

  // Verify in UI
  const row = page.locator(`tr:has-text("${payload.name}")`);
  await expect(row).toBeVisible();
} finally {
  if (createdId) {
    await deleteIntegration(request, createdId);
  }
}
```

### Parametrized Tests

Tests can be parametrized for multiple scenarios:

```typescript
const BUNDLES = ['rhel', 'console', 'openshift', 'ansible'];

for (const bundleName of BUNDLES) {
  test(`should work for ${bundleName}`, async ({ page, request }) => {
    // Test logic
  });
}
```

### Cleanup Strategy

**Critical:** All tests MUST clean up created resources:

- Use `try/finally` blocks
- Delete via API in `finally` block
- Handle 404 gracefully (resource may not exist if creation failed)
- Log cleanup actions for debugging

## Debugging

### Screenshots

Screenshots are taken automatically on failure:

- Location: `test-results/`
- Full page screenshots

### Traces

Traces are collected on first retry:

- View with: `npx playwright show-trace trace.zip`
- Includes network activity, DOM snapshots, console logs

### Console Logs

Tests log progress to console:

```
✓ Created webhook via UI: PW_INT_1234567890_webhook_abc123
✓ Webhook appears in UI table
✓ Cleaned up webhook: abc123-def456
```

## Known Issues & Adaptations

### From IQE Implementation

1. **Navigation wrapper** - IQE uses `with_nav_diagnosis` to mark tests as xfail on navigation issues. Playwright uses retry logic instead.

2. **Feature flags** - Some features are behind Unleash flags:

   - `platform.integrations.behavior-groups-move` - Event types in integration wizard
   - `platform.notifications.overhaul` - New vs legacy routing
   - Check flags before running tests

3. **Event type names** - IQE uses hardcoded event types like "New advisory", "New recommendation". Verify these still exist in current system.

4. **Bundle transformation** - URLs use lowercase bundle names (`/notifications/rhel/...`), not capitalized.

## Migration Status

### Completed ✅

- ✅ Phase 1: Integration navigation test
- ✅ Phase 1: Webhook creation test (3 variants)
- ✅ Phase 1: Behavior group creation test (4 bundles)
- ✅ Phase 2: Communication integrations (Slack, Teams, Google Chat)
- ✅ Phase 2: Reporting integrations (PagerDuty, ServiceNow, Splunk, Ansible)
- ✅ Phase 3: Configure events navigation (5 bundles)
- ✅ Phase 3: Events log navigation and action badges
- ✅ Shared utilities (API, data generators, form helpers)

**All 7 IQE core UI tests have been successfully migrated to Playwright!**

### Optional Future Enhancements

- ⏳ Badge translation component tests (Storybook)
- ⏳ Unit tests for action badge translation logic
- ⏳ Additional edge case testing

## Contributing

When adding new tests:

1. Follow existing patterns (API + UI verification)
2. Use data generators for unique names
3. Add cleanup in `finally` blocks
4. Log progress to console
5. Update this README with test coverage
6. Add JSDoc comments explaining test purpose

## References

- [IQE Test Documentation](/home/jjaquish/repos/jjaquish-rh-notes/iqe-notifications-ui-test-coverage.md)
- [Migration Analysis](../migration_analysis.md)
- [Playwright Documentation](https://playwright.dev)
- [PatternFly 6 Components](https://www.patternfly.org/components)
