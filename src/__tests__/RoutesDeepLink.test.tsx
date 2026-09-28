import { render } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { Routes } from '../Routes';

jest.mock('../pages/Notifications/List/Page', () => ({
  NotificationsListPage: () => 'NotificationsList',
}));
jest.mock('../pages/Integrations/List/Page', () => ({
  IntegrationsListPage: () => 'IntegrationsList',
}));
jest.mock('../pages/Notifications/Overview/Page', () => ({
  NotificationsOverviewPage: () => 'Overview',
}));
jest.mock('../pages/Notifications/EventLog/EventLogPage', () => ({
  EventLogPage: () => 'EventLog',
}));
jest.mock('../pages/Integrations/SplunkSetup/SplunkSetupPage', () => ({
  SplunkSetupPage: () => 'Splunk',
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => () => ({
  getApp: () => 'notifications',
  isBeta: () => false,
  getEnvironment: () => 'bar',
}));

const mockUseFlag = jest.fn(() => true);
jest.mock('@unleash/proxy-client-react', () => ({
  useFlag: () => mockUseFlag(),
}));

const BASENAME = '/settings/notifications';

const renderAt = (entry: string) => {
  const locations: string[] = [];
  const LocationSpy = () => {
    const location = useLocation();
    locations.push(`${location.pathname}${location.search}`);
    return null;
  };

  const { container } = render(
    <MemoryRouter basename={BASENAME} initialEntries={[entry]}>
      <LocationSpy />
      <Routes />
    </MemoryRouter>
  );

  return { locations, rendered: container.textContent };
};

describe('src/Routes deep links', () => {
  beforeEach(() => {
    mockUseFlag.mockReturnValue(true);
  });

  // RHCLOUD-51540: the notifications drawer deep links into the user-preferences
  // micro-frontend, which is served from a sibling module but sits under our
  // basename. The catch-all redirect used to swallow it and drop the query string,
  // so the preferences page fell back to its first bundle (Ansible).
  describe.each([true, false])('with notificationsOverhaul=%s', (overhaul) => {
    beforeEach(() => {
      mockUseFlag.mockReturnValue(overhaul);
    });

    it('leaves the user-preferences deep link untouched for the owning module', () => {
      const { locations, rendered } = renderAt(
        `${BASENAME}/user-preferences?bundle=console&app=rbac`
      );

      expect(locations).toEqual(['/user-preferences?bundle=console&app=rbac']);
      expect(rendered).toBe('');
    });

    it('still redirects genuinely unknown paths', () => {
      // Deep enough to miss the legacy `/:bundleName` route as well.
      const { locations } = renderAt(`${BASENAME}/not/a/real/page`);

      expect(locations[locations.length - 1]).toBe(BASENAME);
    });
  });

  it('routes the event log deep link to the event log page with its filters intact', () => {
    const { locations, rendered } = renderAt(
      `${BASENAME}/eventlog?service=console.rbac&event=Group+created`
    );

    expect(locations).toEqual(['/eventlog?service=console.rbac&event=Group+created']);
    expect(rendered).toBe('EventLog');
  });
});
