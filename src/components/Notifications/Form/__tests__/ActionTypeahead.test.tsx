import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import * as React from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { UserIntegrationType } from '../../../../types/Integration';
import { Action, NotificationType } from '../../../../types/Notification';
import { NotificationUserRecipient } from '../../../../types/Recipient';
import {
  RecipientContext,
  RecipientContextProvider,
} from '../../RecipientContext';
import { ActionTypeahead } from '../ActionTypeahead';

const ALL_RECIPIENTS = [
  new NotificationUserRecipient(undefined, false, false),
  new NotificationUserRecipient(undefined, true, false),
] as ReadonlyArray<NotificationUserRecipient>;

const defaultRecipientContext = (): RecipientContext => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getIntegrations: async (type: UserIntegrationType, _search?: string) => {
    return [
      {
        type,
        id: 'foo',
        isEnabled: true,
        name: 'My integration',
      },
    ];
  },
  getNotificationRecipients: async () => [],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InternalWrapper: React.FunctionComponent<any> = ({
  getLocation,
  children,
}) => {
  const location = useLocation();
  if (getLocation) {
    getLocation.mockImplementation(() => location);
  }

  return children;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Wrapper: React.FunctionComponent<any> = ({
  value,
  children,
  getLocation,
}) => {
  return (
    <MemoryRouter>
      <InternalWrapper getLocation={getLocation}>
        <RecipientContextProvider value={value}>
          {children}
        </RecipientContextProvider>
      </InternalWrapper>
    </MemoryRouter>
  );
};

describe('src/components/Notifications/Form/ActionTypeahead', () => {
  it('Renders the passed action type', async () => {
    const action: Action = {
      type: NotificationType.DRAWER,
      recipient: ALL_RECIPIENTS,
    };
    const context = defaultRecipientContext();
    render(
      <Wrapper value={context}>
        <ActionTypeahead
          selectedNotifications={[]}
          action={action}
          onSelected={fn()}
        />
      </Wrapper>
    );

    await userEvent.click(screen.getByRole('button'));
    await waitForAsyncEvents();

    expect(
      screen.getByRole('option', {
        name: /Send to notification drawer/i,
      })
    ).toBeVisible();
  });

  it('Renders disabled if isDisabled', async () => {
    const action: Action = {
      type: NotificationType.DRAWER,
      recipient: ALL_RECIPIENTS,
    };
    const context = defaultRecipientContext();
    render(
      <Wrapper value={context}>
        <ActionTypeahead
          selectedNotifications={[]}
          action={action}
          isDisabled={true}
          onSelected={fn()}
        />
      </Wrapper>
    );

    await userEvent.click(screen.getByRole('button'));
    await waitForAsyncEvents();

    expect(
      screen.getByRole('button', { name: /Send to notification drawer/i })
    ).toBeDisabled();
  });

  it('Selected notification doesnt show except for Integrations', async () => {
    const action: Action = {
      type: NotificationType.DRAWER,
      recipient: ALL_RECIPIENTS,
    };
    const actionSelected = fn();
    const context = defaultRecipientContext();
    render(
      <Wrapper value={context}>
        <ActionTypeahead
          selectedNotifications={[
            NotificationType.EMAIL_SUBSCRIPTION,
            NotificationType.DRAWER,
            NotificationType.INTEGRATION,
          ]}
          action={action}
          onSelected={actionSelected}
        />
      </Wrapper>
    );

    await userEvent.click(screen.getByRole('button'));
    await waitForAsyncEvents();

    expect(screen.queryByText(/send an email/i)).not.toBeInTheDocument();
    expect(screen.getByText(/integration: webhook/i)).toBeInTheDocument();
    expect(screen.getByText(/integration: splunk/i)).toBeInTheDocument();
  });

  it('Calls actionSelected when selecting any action', async () => {
    const action: Action = {
      type: NotificationType.DRAWER,
      recipient: ALL_RECIPIENTS,
    };
    const actionSelected = fn();
    const context = defaultRecipientContext();
    render(
      <Wrapper value={context}>
        <ActionTypeahead
          selectedNotifications={[]}
          action={action}
          onSelected={actionSelected}
        />
      </Wrapper>
    );

    await userEvent.click(screen.getByRole('button'));
    await waitForAsyncEvents();
    await userEvent.click(screen.getAllByRole('option')[0]);
    await waitForAsyncEvents();
    expect(actionSelected).toHaveBeenCalled();
  });

  it('Closes selection list when clicking on an action', async () => {
    const action: Action = {
      type: NotificationType.DRAWER,
      recipient: ALL_RECIPIENTS,
    };
    const actionSelected = fn();
    const context = defaultRecipientContext();
    render(
      <Wrapper value={context}>
        <ActionTypeahead
          selectedNotifications={[]}
          action={action}
          onSelected={actionSelected}
        />
      </Wrapper>
    );

    await userEvent.click(screen.getByRole('button'));
    await waitForAsyncEvents();
    await userEvent.click(screen.getAllByRole('option')[0]);
    await waitForAsyncEvents();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('Actions are enabled if they have elements', async () => {
    const context = defaultRecipientContext();
    const onSelected = fn();
    render(
      <Wrapper value={context}>
        <ActionTypeahead selectedNotifications={[]} onSelected={onSelected} />
      </Wrapper>
    );
    await userEvent.click(screen.getByRole('button'));
    await waitForAsyncEvents();

    // Get the webhook option button directly by its exact name
    const webhookAction = screen.getByRole('option', {
      name: 'Integration: Webhook',
    });
    expect(webhookAction).toBeEnabled();
    await userEvent.click(webhookAction);
    await waitForAsyncEvents();
    expect(onSelected).toHaveBeenCalled();
  });

  it('Actions are disabled if they have no elements', async () => {
    const context = {
      getIntegrations: async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _type: UserIntegrationType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _search?: string
      ) => [],
      getNotificationRecipients: async () => [],
    };
    const onSelected = fn();
    render(
      <Wrapper value={context}>
        <ActionTypeahead selectedNotifications={[]} onSelected={onSelected} />
      </Wrapper>
    );
    await userEvent.click(screen.getByRole('button'));
    await waitForAsyncEvents();

    const optionButtons = screen.getAllByRole('option');
    const webhookAction = optionButtons.find((button) =>
      within(button).queryByText(/Integration: Webhook/i)
    );
    expect(webhookAction).toBeDefined();

    expect(
      within(webhookAction!).getByText(/You have no integration configured/)
    ).toBeInTheDocument();

    // In PatternFly 6, disabled options may not have aria-disabled but should prevent interaction
    await userEvent.click(webhookAction!);
    await waitForAsyncEvents();
    expect(onSelected).not.toHaveBeenCalled();
  });

  it('Disabled actions have a link to integrations', async () => {
    const context = {
      getIntegrations: async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _type: UserIntegrationType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _search?: string
      ) => [],
      getNotificationRecipients: async () => [],
    };
    render(
      <Wrapper value={context}>
        <ActionTypeahead selectedNotifications={[]} onSelected={fn()} />
      </Wrapper>
    );
    await userEvent.click(screen.getByRole('button'));
    await waitForAsyncEvents();

    const optionButtons = screen.getAllByRole('option');
    const webhookAction = optionButtons.find((button) =>
      within(button).queryByText(/Integration: Webhook/i)
    );
    expect(webhookAction).toBeDefined();

    const link = within(webhookAction!).getByRole('link', {
      name: /integrations/i,
    });

    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    expect(link).toHaveAttribute('target', '_blank');

    // Check that the link points to the correct integrations path
    expect(link).toHaveAttribute('href', '/settings/integrations');
  });
});
