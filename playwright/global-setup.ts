/**
 * Custom global setup for notifications-frontend E2E tests
 * Handles authentication with local dev proxy support
 * Based on learning-resources pattern
 */
import { type FullConfig, type Page, type Request, type Route, chromium } from 'playwright';

async function disableCookiePrompt(page: Page) {
  await page.route('**/*', async (route: Route, request: Request) => {
    const url = request.url();
    if (
      (url.includes('consent.trustarc.com') || url.includes('trustarc.com')) &&
      request.resourceType() !== 'document'
    ) {
      await route.abort();
    } else {
      await route.continue();
    }
  });
}

async function login(page: Page, user: string, password: string) {
  // Fail fast if proxy config is wrong
  const lockdownCount = await page.locator('text=Lockdown').count();
  if (lockdownCount > 0) {
    throw new Error('Proxy config incorrect - Lockdown page detected');
  }

  console.log(`Logging in as ${user}...`);

  // Fill username
  const usernameInput = page
    .getByLabel('Red Hat login')
    .and(page.locator('input:not([readonly])'))
    .first();
  await usernameInput.fill(user);
  await page.getByRole('button', { name: 'Next' }).click();

  // Fill password
  await page.getByLabel('Password').first().fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  // Wait for navigation back to the app
  await page
    .waitForURL('**/settings/**', { timeout: 60000 })
    .catch(() => page.waitForURL('**/', { timeout: 60000 }));

  // Wait for console to be ready
  try {
    await page.getByText('Hi,').waitFor({ state: 'visible', timeout: 60000 });
  } catch {
    await page
      .getByRole('button', { name: 'Add widgets' })
      .waitFor({ state: 'visible', timeout: 60000 });
  }

  console.log('✓ Login successful');
}

async function globalSetup(config: FullConfig) {
  const { storageState, baseURL } = config.projects[0].use;

  // Skip if no storage state configured
  if (!storageState) {
    console.log('No storageState configured, skipping global setup');
    return;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    baseURL: baseURL as string,
  });
  const page = await context.newPage();

  try {
    await disableCookiePrompt(page);

    // Navigate to home
    await page.goto((baseURL as string) || '/', { waitUntil: 'load', timeout: 60000 });

    const user = process.env.E2E_USER;
    const password = process.env.E2E_PASSWORD;

    if (!user || !password) {
      throw new Error('E2E_USER and E2E_PASSWORD environment variables must be set');
    }

    await page.waitForLoadState('load');
    await login(page, user, password);

    // Save authenticated state
    await context.storageState({ path: storageState as string });

    console.log('✅ Authentication state saved to', storageState);
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
