import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import {
  appWrapperCleanup,
  appWrapperSetup,
  getConfiguredAppWrapper,
} from '../../../../test/AppWrapper';
import { DailyDigestTrigger } from '../DailyDigestTrigger';

const mockGetEnvironment = jest.fn();

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({
    getEnvironment: mockGetEnvironment,
    isBeta: jest.fn(() => false),
    auth: { getUser: jest.fn() },
    getApp: jest.fn(),
    getBundle: jest.fn(),
  });
});

jest.mock('../../../api/helpers/notifications/daily-digest-trigger-helper', () => ({
  triggerDailyDigest: jest.fn(),
}));

import { triggerDailyDigest } from '../../../api/helpers/notifications/daily-digest-trigger-helper';

const mockTriggerDailyDigest = triggerDailyDigest as jest.MockedFunction<typeof triggerDailyDigest>;

describe('DailyDigestTrigger', () => {
  beforeEach(() => {
    appWrapperSetup();
    mockGetEnvironment.mockReturnValue('stage');
    mockTriggerDailyDigest.mockResolvedValue();
  });

  afterEach(() => {
    appWrapperCleanup();
    jest.clearAllMocks();
  });

  it('renders trigger card for org admin in stage', () => {
    const Wrapper = getConfiguredAppWrapper({
      appContext: { isOrgAdmin: true },
    });

    render(<DailyDigestTrigger />, { wrapper: Wrapper });

    expect(screen.getByTestId('daily-digest-trigger-card')).toBeInTheDocument();
    expect(screen.getByTestId('daily-digest-trigger-button')).toBeInTheDocument();
  });

  it('does not render for non-admin users', () => {
    const Wrapper = getConfiguredAppWrapper({
      appContext: { isOrgAdmin: false },
    });

    render(<DailyDigestTrigger />, { wrapper: Wrapper });

    expect(screen.queryByTestId('daily-digest-trigger-card')).not.toBeInTheDocument();
  });

  it('does not render in production environment', () => {
    mockGetEnvironment.mockReturnValue('prod');
    const Wrapper = getConfiguredAppWrapper({
      appContext: { isOrgAdmin: true },
    });

    render(<DailyDigestTrigger />, { wrapper: Wrapper });

    expect(screen.queryByTestId('daily-digest-trigger-card')).not.toBeInTheDocument();
  });

  it('shows confirmation modal on button click', async () => {
    const user = userEvent.setup();
    const Wrapper = getConfiguredAppWrapper({
      appContext: { isOrgAdmin: true },
    });

    render(<DailyDigestTrigger />, { wrapper: Wrapper });

    await user.click(screen.getByTestId('daily-digest-trigger-button'));

    expect(
      screen.getByText(/This will send a daily digest email to all users/i)
    ).toBeInTheDocument();
  });

  it('triggers digest on confirm and shows success', async () => {
    const user = userEvent.setup();
    const Wrapper = getConfiguredAppWrapper({
      appContext: { isOrgAdmin: true },
    });

    render(<DailyDigestTrigger />, { wrapper: Wrapper });

    await user.click(screen.getByTestId('daily-digest-trigger-button'));
    await user.click(screen.getByTestId('daily-digest-trigger-confirm'));

    await waitFor(() => {
      expect(mockTriggerDailyDigest).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByTestId('daily-digest-trigger-success')).toBeInTheDocument();
    });
  });

  it('shows error alert on trigger failure', async () => {
    mockTriggerDailyDigest.mockRejectedValue(new Error('API error'));
    const user = userEvent.setup();
    const Wrapper = getConfiguredAppWrapper({
      appContext: { isOrgAdmin: true },
    });

    render(<DailyDigestTrigger />, { wrapper: Wrapper });

    await user.click(screen.getByTestId('daily-digest-trigger-button'));
    await user.click(screen.getByTestId('daily-digest-trigger-confirm'));

    await waitFor(() => {
      expect(screen.getByTestId('daily-digest-trigger-error')).toBeInTheDocument();
    });
  });

  it('renders in stage-beta environment', () => {
    mockGetEnvironment.mockReturnValue('stage-beta');
    const Wrapper = getConfiguredAppWrapper({
      appContext: { isOrgAdmin: true },
    });

    render(<DailyDigestTrigger />, { wrapper: Wrapper });

    expect(screen.getByTestId('daily-digest-trigger-card')).toBeInTheDocument();
  });
});
