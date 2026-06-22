import { Page, expect } from '@playwright/test';
import {
  disableCookiePrompt as packageDisableCookiePrompt,
  login as packageLogin,
} from '@redhat-cloud-services/playwright-test-auth';

/** Paths relative to `use.baseURL` in playwright.config.ts */
export const NOTIFICATIONS_PATH = '/settings/notifications';
export const INTEGRATIONS_PATH = '/settings/integrations';

/** Matches playwright.config `baseURL` — for callers that need a full URL string. */
export const getBaseURL = () =>
  process.env.PLAYWRIGHT_BASE_URL || 'https://stage.foo.redhat.com:1337';

/**
 * Block TrustArc consent iframes/overlays.
 * @deprecated Use `disableCookiePrompt` from `@redhat-cloud-services/playwright-test-auth` directly.
 */
export async function disableCookiePrompt(page: Page) {
  await packageDisableCookiePrompt(page);
}

/**
 * Perform Red Hat SSO login.
 * @deprecated Use `login` from `@redhat-cloud-services/playwright-test-auth` directly.
 */
export async function login(page: Page, user: string, password: string): Promise<void> {
  await packageLogin(page, user, password);
}

/**
 * Ensure the user is logged in before running tests.
 * @deprecated Configure `globalSetup` in playwright.config.ts using
 * `@redhat-cloud-services/playwright-test-auth/global-setup` instead.
 * With globalSetup, auth happens once and the session is reused via storageState.
 */
export async function ensureLoggedIn(page: Page): Promise<void> {
  await disableCookiePrompt(page);

  await page.goto('/', { waitUntil: 'load', timeout: 60000 });

  const loggedIn = await page.getByText('Hi,').isVisible();

  if (!loggedIn) {
    const user = process.env.E2E_USER!;
    const password = process.env.E2E_PASSWORD!;
    await page.waitForLoadState('load');
    await expect(page.getByLabel('Red Hat login')).toBeVisible({
      timeout: 10000,
    });
    await login(page, user, password);
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);
    await expect(page.getByText('Invalid login')).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Add widgets' }),
      'dashboard not displayed'
    ).toBeVisible({ timeout: 30000 });

    const acceptAllButton = page.getByRole('button', { name: 'Accept all' });
    if (await acceptAllButton.isVisible()) {
      await acceptAllButton.click();
    }
  }
}
