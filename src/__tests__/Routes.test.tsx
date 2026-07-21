import { render, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../test/AppWrapper';
import { Routes } from '../Routes';

jest.mock('../pages/Notifications/List/Page', () => ({
  NotificationsListPage: () => 'Notifications',
}));

jest.mock('../pages/Integrations/List/Page', () => ({
  IntegrationsListPage: () => 'Integrations',
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    getApp: () => 'notifications',
    isBeta: () => false,
    getEnvironment: () => 'bar',
  });
});

describe('src/Routes', () => {
  describe('App Wrapped', () => {
    beforeEach(() => {
      appWrapperSetup();
      fetchMock.get(`/api/featureflags/v0`, {
        body: {
          toggles: [],
        },
      });
    });

    afterEach(() => {
      appWrapperCleanup();
    });

    it('Overview renders without permission check', async () => {
      jest.useFakeTimers();
      const Wrapper = getConfiguredAppWrapper({
        router: {
          initialEntries: ['/settings/notifications'],
          basename: '/settings/notifications',
        },
      });
      render(<Routes />, {
        wrapper: Wrapper,
      });

      expect(screen.queryByRole('link', { name: 'Go to landing page' })).not.toBeInTheDocument();
    });
  });
});
