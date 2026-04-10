import { Page, expect } from '@playwright/test';

/** Paths relative to `use.baseURL` in playwright.config.ts */
export const NOTIFICATIONS_PATH = '/settings/notifications';
export const INTEGRATIONS_PATH = '/settings/integrations';

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

export async function login(page: Page, user: string, password: string): Promise<void> {
  await expect(page.locator('text=Lockdown'), 'proxy config incorrect').toHaveCount(0);

  await removeTrustArcOverlay(page);

  await page.getByLabel('Red Hat login').first().fill(user);
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByLabel('Password').first().fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByText('Invalid login')).not.toBeVisible();
}

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
    await removeTrustArcOverlay(page);
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
