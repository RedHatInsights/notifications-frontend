import { render, screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import {
  appWrapperCleanup,
  appWrapperSetup,
  getConfiguredAppWrapper,
} from '../../../test/AppWrapper';
import { CheckReadPermissions } from '../CheckReadPermissions';

const mockGetApp = jest.fn();

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    getApp: mockGetApp,
    isBeta: () => false,
    getEnvironment: () => 'ci',
  });
});

const childText = 'Authorized Content';

describe('CheckReadPermissions', () => {
  beforeEach(() => {
    appWrapperSetup();
    fetchMock.get(`/api/featureflags/v0`, {
      body: { toggles: [] },
    });
  });

  afterEach(() => {
    appWrapperCleanup();
  });

  it('Shows children when user has canReadNotifications for notification pages', () => {
    mockGetApp.mockReturnValue('notifications');
    const Wrapper = getConfiguredAppWrapper({
      router: { initialEntries: ['/rhel'] },
      appContext: { rbac: { canReadNotifications: true } },
    });

    render(
      <CheckReadPermissions>
        <div>{childText}</div>
      </CheckReadPermissions>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText(childText)).toBeVisible();
  });

  it('Shows unauthorized when user lacks canReadNotifications for notification pages', () => {
    mockGetApp.mockReturnValue('notifications');
    const Wrapper = getConfiguredAppWrapper({
      router: { initialEntries: ['/rhel'] },
      appContext: { rbac: { canReadNotifications: false } },
    });

    render(
      <CheckReadPermissions>
        <div>{childText}</div>
      </CheckReadPermissions>,
      { wrapper: Wrapper }
    );

    expect(screen.queryByText(childText)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /User Preferences/i })).toBeInTheDocument();
  });

  it('Shows children for /notificationslog regardless of canReadNotifications', () => {
    mockGetApp.mockReturnValue('notifications');
    const Wrapper = getConfiguredAppWrapper({
      router: { initialEntries: ['/notificationslog'] },
      appContext: { rbac: { canReadNotifications: false } },
    });

    render(
      <CheckReadPermissions>
        <div>{childText}</div>
      </CheckReadPermissions>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText(childText)).toBeVisible();
  });

  it('Shows children for /eventlog when user has canReadEvents', () => {
    mockGetApp.mockReturnValue('notifications');
    const Wrapper = getConfiguredAppWrapper({
      router: { initialEntries: ['/eventlog'] },
      appContext: { rbac: { canReadEvents: true } },
    });

    render(
      <CheckReadPermissions>
        <div>{childText}</div>
      </CheckReadPermissions>,
      { wrapper: Wrapper }
    );

    expect(screen.getByText(childText)).toBeVisible();
  });

  it('Shows unauthorized for /eventlog when user lacks canReadEvents', () => {
    mockGetApp.mockReturnValue('notifications');
    const Wrapper = getConfiguredAppWrapper({
      router: { initialEntries: ['/eventlog'] },
      appContext: { rbac: { canReadEvents: false } },
    });

    render(
      <CheckReadPermissions>
        <div>{childText}</div>
      </CheckReadPermissions>,
      { wrapper: Wrapper }
    );

    expect(screen.queryByText(childText)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /User Preferences/i })).toBeInTheDocument();
  });
});
