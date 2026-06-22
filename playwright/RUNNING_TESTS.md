# Running Playwright Tests

The Playwright tests are configured by default to run against the **local development proxy** (`https://stage.foo.redhat.com:1337`).

This requires running the local dev server (`npm start`) and proper `/etc/hosts` configuration. For remote testing without a local proxy, you can override the base URL to `https://console.stage.redhat.com`.

## Prerequisites

### 1. Authentication Credentials

Set environment variables for Red Hat SSO authentication:

```bash
export E2E_USER="your-redhat-username"
export E2E_PASSWORD="your-redhat-password"
```

Or create a `.env` file in the project root:

```env
E2E_USER=your-redhat-username
E2E_PASSWORD=your-redhat-password
```

## Running Tests

### Against Local Dev Proxy (Default)

Tests run against `https://stage.foo.redhat.com:1337` by default (requires `npm start`):

```bash
# Run all migrated tests
npx playwright test integrations-ui.spec.ts notifications-ui.spec.ts

# Run only integration tests
npx playwright test integrations-ui.spec.ts

# Run only notification tests
npx playwright test notifications-ui.spec.ts

# Run in UI mode (interactive debugging)
npx playwright test --ui

# Run specific test suite
npx playwright test integrations-ui.spec.ts -g "Webhook Integration"

# Run with headed browser (see what's happening)
npx playwright test --headed

# Debug a specific test
npx playwright test integrations-ui.spec.ts --debug
```

## Running Against Remote Stage (Optional)

If you want to test against remote stage without a local proxy:

```bash
# Set environment variable to override the default
export PLAYWRIGHT_BASE_URL="https://console.stage.redhat.com"

# Run tests
npx playwright test
```

**Note:** Most local development uses the default local proxy (`stage.foo.redhat.com:1337`).

## Troubleshooting

### Connection Refused Error

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at https://console.stage.redhat.com/
```

**Solution:** Check your network connectivity to Red Hat stage environment. You may need VPN access.

### Invalid Login Error

**Solution:** Check your `E2E_USER` and `E2E_PASSWORD` environment variables are set correctly.

### HTTPS Certificate Errors

**Solution:** The tests are configured with `ignoreHTTPSErrors: true` in `playwright.config.ts`, so this should be handled automatically.

### Tests Timeout

**Solution:**

- Ensure your local dev server is fully started and accessible
- Check network connectivity
- Increase timeout in `playwright.config.ts` if needed (currently 180s)

## Test Execution Notes

### Serial Execution

Tests run **serially** (one at a time) because:

- They create and delete real resources via API
- Parallel execution can cause race conditions
- Follows Konflux CI/CD standards for this project

### Cleanup

All tests include cleanup in `finally` blocks:

- Integrations are deleted after creation tests
- Behavior groups are deleted after creation tests
- No test data should be left behind

### Performance

Running all 46 tests takes approximately **15-25 minutes** due to:

- Serial execution
- Multiple wizard workflows
- API calls and UI verification
- SSO authentication

## CI/CD Integration

In CI (Konflux), tests run with:

- `fullyParallel: false` (serial execution)
- `retries: 2` (retry on failure)
- `timeout: 180000` (3 minutes per test)
- Chromium browser only

## Quick Reference

| Command                        | Description               |
| ------------------------------ | ------------------------- |
| `npm start`                    | Start local dev server    |
| `npx playwright test`          | Run all tests             |
| `npx playwright test --ui`     | Interactive test runner   |
| `npx playwright test --headed` | Run with visible browser  |
| `npx playwright test --debug`  | Debug mode (step through) |
| `npx playwright show-report`   | View HTML test report     |

## Environment Variables

| Variable              | Required | Description       | Example                            |
| --------------------- | -------- | ----------------- | ---------------------------------- |
| `E2E_USER`            | Yes      | Red Hat username  | `jsmith`                           |
| `E2E_PASSWORD`        | Yes      | Red Hat password  | `********`                         |
| `PLAYWRIGHT_BASE_URL` | No       | Override base URL | `https://console.stage.redhat.com` |

## Example Workflow

```bash
# Set credentials
export E2E_USER="your-redhat-username"
export E2E_PASSWORD="your-redhat-password"

# Run tests against local dev proxy
npx playwright test integrations-ui.spec.ts --headed

# Watch the tests run in the browser!
```

## Tips

1. **Use `--headed` mode** during development to see what the tests are doing
2. **Use `--ui` mode** for interactive debugging
3. **Run individual test suites** first to verify setup before running all tests
4. **Check console logs** in the test output for detailed information
5. **Screenshot on failure** is enabled - check `test-results/` folder

## Next Steps

Once tests are running successfully:

1. Review test results and fix any failures
2. Add to CI/CD pipeline
3. Consider adding more test coverage for edge cases
4. Update documentation if test patterns change
