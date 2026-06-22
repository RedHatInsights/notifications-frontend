import { Page, expect } from '@playwright/test';

/** Paths relative to `use.baseURL` in playwright.config.ts */
export const NOTIFICATIONS_PATH = '/settings/notifications';
export const INTEGRATIONS_PATH = '/settings/integrations';

/** Bundle names for parametrized tests */
export const BUNDLES = ['rhel', 'console', 'openshift', 'ansible'];

/** Matches playwright.config `baseURL` — for callers that need a full URL string. */
export const getBaseURL = () =>
  process.env.PLAYWRIGHT_BASE_URL || 'https://stage.foo.redhat.com:1337';

function isTrustArcHost(hostname: string): boolean {
  return hostname === 'trustarc.com' || hostname.endsWith('.trustarc.com');
}

/**
 * Block TrustArc consent iframes/overlays (consent.trustarc.com, consent-pref.trustarc.com, …).
 * Must run before the first navigation so the overlay never loads (CI: iframe intercepts SSO clicks).
 */
export async function disableCookiePrompt(page: Page) {
  await page.route('**/*', async (route, request) => {
    try {
      const url = new URL(request.url());
      if (isTrustArcHost(url.hostname)) {
        await route.abort();
      } else {
        await route.continue();
      }
    } catch {
      await route.continue();
    }
  });
}

/** Best-effort DOM cleanup if TrustArc slipped through before routes applied. */
async function removeTrustArcOverlay(page: Page) {
  await page
    .evaluate(() => {
      document
        .querySelectorAll('.truste_box_overlay, iframe[name="trustarc_cm"], iframe.truste_popframe')
        .forEach((el) => el.remove());
    })
    .catch(() => undefined);
}

/** Dismiss cookie consent banner if visible */
export async function dismissCookieConsent(page: Page): Promise<void> {
  const acceptCookies = page
    .getByRole('button', { name: 'Accept all' })
    .or(page.getByRole('button', { name: 'Accept' }));
  if (await acceptCookies.isVisible({ timeout: 2000 }).catch(() => false)) {
    await acceptCookies.click();
    await page.waitForTimeout(500);
  }
}

export async function login(page: Page, user: string, password: string): Promise<void> {
  await expect(page.locator('text=Lockdown'), 'proxy config incorrect').toHaveCount(0);

  await removeTrustArcOverlay(page);

  console.log('Attempting login...');

  // Use the visible, enabled input field (not the readonly one)
  const usernameInput = page
    .getByLabel('Red Hat login')
    .and(page.locator('input:not([readonly])'))
    .first();
  await usernameInput.fill(user);
  await page.getByRole('button', { name: 'Next' }).click();

  // Wait for password field to appear and be ready
  const passwordInput = page.getByLabel('Password').first();
  await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(500);

  // Click into the field first to ensure it's focused
  await passwordInput.click();
  await page.waitForTimeout(200);

  // Type the password character by character (more realistic)
  await passwordInput.pressSequentially(password, { delay: 50 });

  console.log(`Password field filled, clicking Log in button`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Log in' }).click();

  // Wait a bit for login to process
  await page.waitForTimeout(2000);

  // Check if login failed
  const invalidLoginVisible = await page
    .getByText('Invalid login')
    .isVisible()
    .catch(() => false);
  if (invalidLoginVisible) {
    throw new Error(`Invalid login credentials for user: ${user}`);
  }
}

/**
 * Ensure user is logged in before running tests.
 * Handles SSO authentication manually.
 */
export async function ensureLoggedIn(page: Page): Promise<void> {
  await disableCookiePrompt(page);

  await page.goto('/', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);

  // Check if we got redirected to SSO or are on login page
  const currentUrl = page.url();
  const isOnSSOPage =
    currentUrl.includes('sso.stage.redhat.com') ||
    currentUrl.includes('sso.redhat.com') ||
    (await page
      .getByLabel('Red Hat login')
      .isVisible({ timeout: 2000 })
      .catch(() => false));

  if (isOnSSOPage) {
    console.log('On SSO page, logging in...');
    const user = process.env.E2E_USER;
    const password = process.env.E2E_PASSWORD;

    if (!user || !password) {
      throw new Error('E2E_USER and E2E_PASSWORD environment variables must be set');
    }

    await removeTrustArcOverlay(page);
    await login(page, user, password);
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // Verify login succeeded (not still on SSO page with error)
    await expect(page.getByText('Invalid login')).not.toBeVisible();

    // Dismiss cookie consent if present
    const acceptAllButton = page.getByRole('button', { name: 'Accept all' });
    if (await acceptAllButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await acceptAllButton.click();
    }

    console.log('✓ Login successful');
  } else {
    // Not redirected to SSO - check if we're actually logged in or have an auth failure
    const currentUrl = page.url();

    // If we're still on SSO login page, that's a real failure
    if (currentUrl.includes('sso.stage.redhat.com') || currentUrl.includes('sso.redhat.com')) {
      throw new Error(
        `Still on SSO page after navigation, possible auth failure. Current URL: ${currentUrl}`
      );
    }

    // Otherwise assume we're logged in
    console.log('✓ Already logged in or login not required');
  }
}
