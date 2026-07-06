import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for notifications-frontend E2E tests
 *
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './playwright',

  // Test timeout reduced from 180s to 60s - if a test can't complete in 60s, something is fundamentally wrong
  timeout: 60 * 1000,

  // Serial execution — parallel runs are flaky in CI (Konflux E2E rules; widget-layout#298)
  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  workers: 1,

  // Reporter to use
  reporter: 'html',

  // Global setup: authenticate once and save session state
  globalSetup: './playwright/global-setup.ts',

  // Shared settings for all the projects below
  use: {
    // PLAYWRIGHT_BASE_URL overrides for local runs against stage; default is the dev proxy (Konflux E2E rules)
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://stage.foo.redhat.com:1337',

    // Ignore HTTPS errors for local dev server
    ignoreHTTPSErrors: true,

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot only on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Reuse authenticated state from global setup
        storageState: 'playwright/.auth/user.json',
      },
    },
  ],
});
