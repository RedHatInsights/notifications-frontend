/**
 * Re-export shared auth utilities from @redhat-cloud-services/playwright-test-auth.
 * Authentication is handled globally via globalSetup + storageState in playwright.config.ts.
 * Individual tests only need `disableCookiePrompt` to prevent cookie banners from interfering.
 */
import type { Page } from '@playwright/test';

export { disableCookiePrompt } from '@redhat-cloud-services/playwright-test-auth';

/** Dismiss cookie consent banner if visible (belt-and-suspenders alongside disableCookiePrompt). */
export async function dismissCookieConsent(page: Page): Promise<void> {
  const acceptCookies = page
    .getByRole('button', { name: 'Accept all' })
    .or(page.getByRole('button', { name: 'Accept' }));
  if (await acceptCookies.isVisible({ timeout: 2000 }).catch(() => false)) {
    await acceptCookies.click();
    await page.waitForTimeout(500);
  }
}

/** Paths relative to `use.baseURL` in playwright.config.ts */
export const NOTIFICATIONS_PATH = '/settings/notifications';
export const INTEGRATIONS_PATH = '/settings/integrations';

/** Bundle names for parametrized tests */
export const BUNDLES = ['rhel', 'console', 'openshift', 'ansible'];

/** Matches playwright.config `baseURL` — for callers that need a full URL string. */
export const getBaseURL = () =>
  process.env.PLAYWRIGHT_BASE_URL || 'https://stage.foo.redhat.com:1337';

/**
 * Symbolic timeout constants — avoid hard-coded values in test code.
 * Centralised here so every spec uses the same set.
 */
export const TIMEOUTS = {
  /** Full page/SSO load (navigation, first paint). */
  PAGE_LOAD: 60_000,
  /** Drawer / panel animation + data fetch. */
  DRAWER_READY: 30_000,
  /** Dropdown, tooltip, popover visibility — generous for CI resource limits. */
  ELEMENT_VISIBLE: 10_000,
  /** Server-side state change round-trip (mark read, bulk ops). */
  API_RESPONSE: 10_000,
  /** Spinner disappearance after data load. */
  SPINNER_GONE: 30_000,
} as const;
