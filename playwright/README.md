# Playwright E2E Tests

End-to-end tests for the notifications frontend using Playwright.

## Quick Start

```bash
# Set credentials
export E2E_USER="your-redhat-username"
export E2E_PASSWORD="your-redhat-password"

# Run all tests
npx playwright test playwright/integrations-ui.spec.ts playwright/notifications-ui.spec.ts

# Run specific test file
npx playwright test playwright/integrations-ui.spec.ts

# Interactive mode (recommended for debugging)
npx playwright test --ui

# Run with visible browser
npx playwright test --headed
```

## Test Files

- `integrations-ui.spec.ts` - Integration lifecycle tests (create, verify, delete webhooks/communications)
- `notifications-ui.spec.ts` - Notification behavior group lifecycle tests
- `test-utils.ts` - Shared utilities (auth, navigation)
- `utils/data-generators.ts` - Generate unique test data
- `utils/form-helpers.ts` - Form filling helpers for wizards
- `test-constants.ts` - Timeout constants with documentation

## Prerequisites

Tests run against the local development proxy (`https://stage.foo.redhat.com:1337`) by default.

1. **Start dev server**: `npm start` in another terminal
2. **Set credentials**: Export `E2E_USER` and `E2E_PASSWORD` environment variables
3. **VPN**: Ensure VPN is connected for stage environment access

## Common Commands

```bash
# Run specific test suite
npx playwright test -g "Webhook"

# Debug a test (step through)
npx playwright test --debug

# View last test report
npx playwright show-report
```

## Test Philosophy

These tests follow the **pure UI user journey** pattern:

- Create via UI wizard
- Verify item appears in UI
- Delete via UI
- No API backdoors or shortcuts

This validates the full user experience end-to-end.

## Troubleshooting

### Tests fail with authentication error

- Check `E2E_USER` and `E2E_PASSWORD` are set
- Clear cached auth state: `rm -rf playwright/.auth`
- Verify VPN connection is active

### Connection refused

- Ensure `npm start` is running
- Check VPN connection
- Verify `/etc/hosts` has stage.foo.redhat.com entry

### Tests timeout

- Module federation apps can be slow to load
- Check network connectivity
- Increase timeout in `playwright.config.ts` if needed
