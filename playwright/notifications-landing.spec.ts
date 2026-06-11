import { expect, test } from '@playwright/test';
import { NOTIFICATIONS_PATH, ensureLoggedIn } from './test-utils';

// Timeout constants - use symbolic constants instead of hard-coded values
const TIMEOUTS = {
  PAGE_LOAD: 60000,
  ELEMENT_VISIBLE: 10000,
  API_RESPONSE: 30000,
} as const;

test.describe('Notifications Landing Page', () => {
  test.beforeEach(async ({ page }): Promise<void> => {
    // Ensure user is logged in
    await ensureLoggedIn(page);

    // Navigate to the notifications overview/landing page
    await page.goto(NOTIFICATIONS_PATH, {
      waitUntil: 'load',
      timeout: TIMEOUTS.PAGE_LOAD,
    });
  });

  test('should display landing page controls and content', async ({ page }) => {
    // Wait for the page to finish loading (spinner to disappear)
    await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.PAGE_LOAD });

    // Main heading
    await expect(page.getByRole('heading', { name: 'Notifications', level: 1 })).toBeVisible({
      timeout: TIMEOUTS.ELEMENT_VISIBLE,
    });

    // Wait for the main content card to appear (confirms isOrgAdmin state is resolved)
    const mainContentCard = page.locator('.pf-v5-c-card, .pf-v6-c-card').first();
    await expect(mainContentCard).toBeVisible({ timeout: TIMEOUTS.API_RESPONSE });

    // Main "Configure events" button (org admin view)
    // Note: This button only appears for org admins
    // Filter to get the primary button, not the navigation link
    const configureEventsButton = page.getByRole('link', { name: 'Configure events' }).filter({ hasText: 'Configure events' }).and(page.locator('.pf-v6-c-button.pf-m-primary'));
    const isConfigureEventsVisible = await configureEventsButton.isVisible();

    if (isConfigureEventsVisible) {
      // Org admin view - verify "Configure events" button
      await expect(configureEventsButton).toHaveText('Configure events');

      // Supporting features list - verify all action links
      const supportingFeaturesList = page.getByRole('list', {
        name: 'Supporting features list',
      });

      // Manage action - Go to Notification Preferences
      await expect(
        supportingFeaturesList.getByRole('link', {
          name: 'Go to Notification Preferences',
        })
      ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

      // Monitor action - View Event log
      await expect(
        supportingFeaturesList.getByRole('link', {
          name: 'View Event log',
        })
      ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

      // Setup action - Set up Integrations
      await expect(
        supportingFeaturesList.getByRole('link', {
          name: 'Set up Integrations',
        })
      ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

      // Create action - Create new behavior group
      await expect(
        supportingFeaturesList.getByRole('link', {
          name: 'Create new behavior group',
        })
      ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

      // Manage errata action - now available on both stage and prod
      await expect(
        supportingFeaturesList.getByRole('link', {
          name: 'Manage subscriptions errata',
        })
      ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

      // Check for Recommended content section (may require scrolling)
      const recommendedContentHeading = page.getByRole('heading', {
        name: 'Recommended content',
        level: 2,
      });

      // Scroll to the recommended content section
      await recommendedContentHeading.scrollIntoViewIfNeeded();
      await expect(recommendedContentHeading).toBeVisible({
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });

      // Verify recommended content items are visible
      // The structure may be a table or list depending on the migration state
      await expect(page.getByText('Configuring Notifications')).toBeVisible({
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });

      await expect(page.getByText('Configuring Integrations')).toBeVisible({
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });

      await expect(
        page.getByText('Restricting access to a service to a team')
      ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

      // Verify action links exist
      const viewDocLinks = page.getByRole('link', { name: /View documentation/i });
      await expect(viewDocLinks.first()).toBeVisible({
        timeout: TIMEOUTS.ELEMENT_VISIBLE,
      });

      await expect(
        page.getByRole('link', { name: /Begin Quick start/i })
      ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
    } else {
      // Non-org admin view - verify different content
      // Non-admins see "Go to Notification Preferences" instead of "Configure events"
      await expect(
        page.getByRole('link', { name: 'Go to Notification Preferences' })
      ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
    }

    // View all resources link (appears for both org admins and regular users)
    const viewAllResourcesLink = page.getByRole('link', {
      name: 'View all Settings Learning Resources',
    });
    await expect(viewAllResourcesLink).toBeVisible({
      timeout: TIMEOUTS.ELEMENT_VISIBLE,
    });
    await expect(viewAllResourcesLink).toHaveText('View all Settings Learning Resources');
  });
});
