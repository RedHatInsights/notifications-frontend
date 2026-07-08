import { Page, expect } from '@playwright/test';

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
  /** Dropdown, tooltip, popover visibility. */
  ELEMENT_VISIBLE: 5_000,
  /** Server-side state change round-trip (mark read, bulk ops). */
  API_RESPONSE: 10_000,
  /** Spinner disappearance after data load. */
  SPINNER_GONE: 30_000,
} as const;

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

  await page.getByLabel('Red Hat login').first().fill(user);
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByLabel('Password').first().fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByText('Invalid login')).not.toBeVisible();
}

/**
 * Ensure user is logged in before running tests.
 *
 * Navigates to "/" and checks whether the user is already authenticated.
 * If not (SSO redirect), performs a full login flow.
 */
export async function ensureLoggedIn(page: Page): Promise<void> {
  await disableCookiePrompt(page);

  await page.goto('/', { waitUntil: 'load', timeout: TIMEOUTS.PAGE_LOAD });

  let loggedIn = false;
  try {
    await expect(page.getByText('Hi,')).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
    loggedIn = true;
  } catch {
    // Not logged in — proceed with login flow
  }

  if (!loggedIn) {
    const user = process.env.E2E_USER!;
    const password = process.env.E2E_PASSWORD!;
    await page.waitForLoadState('load');
    await expect(page.getByLabel('Red Hat login')).toBeVisible({
      timeout: TIMEOUTS.API_RESPONSE,
    });
    await removeTrustArcOverlay(page);
    await login(page, user, password);
    await page.waitForLoadState('load');
    await expect(
      page.getByRole('button', { name: 'Add widgets' }),
      'dashboard not displayed'
    ).toBeVisible({ timeout: TIMEOUTS.DRAWER_READY });

    // Dismiss cookie consent if present
    await dismissCookieConsent(page);
  }
}
