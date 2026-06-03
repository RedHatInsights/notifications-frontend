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
    // Main heading
    await expect(page.getByRole('heading', { name: 'Notifications', level: 1 })).toBeVisible({
      timeout: TIMEOUTS.ELEMENT_VISIBLE,
    });

    // Main "Configure events" button (org admin view)
    // Note: This button only appears for org admins
    const configureEventsButton = page.getByRole('link', { name: 'Configure events' });
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

      // Manage errata action - conditionally check (stage-only feature)
      // This is behind the platform.notifications.errata.userpreferences feature flag
      const manageErrataLink = supportingFeaturesList.getByRole('link', {
        name: 'Manage subscriptions errata',
      });

      // Check if errata link exists (feature flagged)
      const isErrataVisible = await manageErrataLink.isVisible();
      if (isErrataVisible) {
        await expect(manageErrataLink).toBeVisible({
          timeout: TIMEOUTS.ELEMENT_VISIBLE,
        });
      }

      // Recommended content table
      const recommendedContentTable = page.getByRole('table', {
        name: 'Recommended content',
      });

      // Notifications action - View documentation
      await expect(
        recommendedContentTable
          .getByRole('row')
          .filter({ hasText: 'Configuring Notifications' })
          .getByRole('link', { name: /View documentation/i })
      ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

      // Integrations action - View documentation
      await expect(
        recommendedContentTable
          .getByRole('row')
          .filter({ hasText: 'Configuring Integrations' })
          .getByRole('link', { name: /View documentation/i })
      ).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });

      // Restricting action - Begin Quick start
      await expect(
        recommendedContentTable
          .getByRole('row')
          .filter({ hasText: 'Restricting access to a service to a team' })
          .getByRole('link', { name: /Begin Quick start/i })
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
