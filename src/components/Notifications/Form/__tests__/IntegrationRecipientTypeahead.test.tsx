import { ouiaSelectors } from '@redhat-cloud-services/frontend-components-testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';
import { fn } from 'jest-mock';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { IntegrationType } from '../../../../types/Integration';
import {
  ActionIntegration,
  BehaviorGroup,
  IntegrationRef,
  NotificationType,
} from '../../../../types/Notification';
import {
  GetIntegrations,
  RecipientContext,
  RecipientContextProvider,
} from '../../RecipientContext';
import { IntegrationRecipientTypeahead } from '../IntegrationRecipientTypeahead';

const ref1: IntegrationRef = {
  id: '1234',
  type: IntegrationType.WEBHOOK,
  isEnabled: true,
  name: 'Integration 1234',
};

const ref2: IntegrationRef = {
  id: 'abcd',
  type: IntegrationType.WEBHOOK,
  isEnabled: true,
  name: 'ABCD',
};

const getConfiguredWrapper = (
  getIntegrations?: GetIntegrations,
  initialFormik?: Partial<BehaviorGroup>
) => {
  const context: RecipientContext = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getIntegrations: getIntegrations ?? fn<any, any>(async () => [ref1, ref2]),
    getNotificationRecipients: fn(),
  };

  const Wrapper: React.FunctionComponent = (props) => {
    return (
      <RecipientContextProvider value={context}>
        <Formik<Partial<BehaviorGroup>>
          initialValues={initialFormik ?? {}}
          onSubmit={() => undefined}
        >
          {props.children}
        </Formik>
      </RecipientContextProvider>
    );
  };

  return Wrapper;
};

describe('src/components/Notifications/Form/IntegrationRecipientTypeAhead', () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it('Renders', async () => {
    render(
      <IntegrationRecipientTypeahead
        selected={undefined}
        integrationType={IntegrationType.WEBHOOK}
        onSelected={fn()}
      />,
      {
        wrapper: getConfiguredWrapper(),
      }
    );
    await waitForAsyncEvents();
    expect(ouiaSelectors.getByOuia('PF4/Select')).toBeVisible();
  });

  it('Renders with existing notifications that are not Integrations', async () => {
    const actions = [
      {
        recipient: {},
        type: NotificationType.EMAIL_SUBSCRIPTION,
      },
      {
        integration: ref1,
        type: NotificationType.INTEGRATION,
      },
    ] as ActionIntegration[];
    const formikValues: Partial<BehaviorGroup> = { actions };

    render(
      <IntegrationRecipientTypeahead
        selected={undefined}
        integrationType={IntegrationType.WEBHOOK}
        onSelected={fn()}
      />,
      {
        wrapper: getConfiguredWrapper(undefined, formikValues),
      }
    );

    await waitForAsyncEvents();
    expect(ouiaSelectors.getByOuia('PF4/Select')).toBeVisible();
  });

  it('Renders disabled if isDisabled', async () => {
    render(
      <IntegrationRecipientTypeahead
        selected={undefined}
        integrationType={IntegrationType.WEBHOOK}
        onSelected={fn()}
        isDisabled={true}
      />,
      {
        wrapper: getConfiguredWrapper(),
      }
    );
    await waitForAsyncEvents();
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('Renders the selected even if getIntegrations does not yield it', async () => {
    render(
      <IntegrationRecipientTypeahead
        selected={ref1}
        integrationType={IntegrationType.WEBHOOK}
        onSelected={fn()}
      />,
      {
        wrapper: getConfiguredWrapper(async () => []),
      }
    );

    await waitForAsyncEvents();
    expect(screen.getByDisplayValue('Integration 1234')).toBeVisible();
  });

  it('Clicking will show the options', async () => {
    jest.useFakeTimers();
    render(
      <IntegrationRecipientTypeahead
        selected={undefined}
        integrationType={IntegrationType.WEBHOOK}
        onSelected={fn()}
      />,
      {
        wrapper: getConfiguredWrapper(),
      }
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: /Options menu/i,
      })
    );

    await waitForAsyncEvents();
    await act(async () => {
      jest.runAllTimers();
    });
    expect(screen.getByText('Integration 1234')).toBeVisible();
  });

  it('getIntegrations is called on init', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getIntegrations = fn<any, any>(async () => [ref1, ref2]);
    render(
      <IntegrationRecipientTypeahead
        selected={undefined}
        integrationType={IntegrationType.WEBHOOK}
        onSelected={fn()}
      />,
      {
        wrapper: getConfiguredWrapper(getIntegrations),
      }
    );
    await waitForAsyncEvents();
    expect(getIntegrations).toHaveBeenCalledWith(IntegrationType.WEBHOOK, '');
  });

  it('When writing, getIntegrations is called with the input', async () => {
    jest.useFakeTimers();
    const guyRef: IntegrationRef = {
      id: '1234',
      type: IntegrationType.WEBHOOK,
      isEnabled: true,
      name: 'guy integration',
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getIntegrations = fn<any, any>(async (type, search) => {
      if (search === 'guy') {
        return [guyRef];
      }

      return [ref1, ref2];
    });

    render(
      <IntegrationRecipientTypeahead
        selected={undefined}
        integrationType={IntegrationType.WEBHOOK}
        onSelected={fn()}
      />,
      {
        wrapper: getConfiguredWrapper(getIntegrations),
      }
    );
    await waitForAsyncEvents();

    await userEvent.type(screen.getByRole('textbox'), 'guy');
    await act(async () => {
      jest.runAllTimers();
    });
    await waitFor(() =>
      expect(getIntegrations).toHaveBeenCalledWith(
        IntegrationType.WEBHOOK,
        'guy'
      )
    );
    await act(async () => {
      jest.runAllTimers();
    });
    expect(await screen.findByText('guy integration')).toBeInTheDocument();
  });

  it('onSelected GetsCalled when selecting an element', async () => {
    jest.useFakeTimers();
    const onSelected = fn();
    render(
      <IntegrationRecipientTypeahead
        selected={undefined}
        integrationType={IntegrationType.WEBHOOK}
        onSelected={onSelected}
      />,
      {
        wrapper: getConfiguredWrapper(),
      }
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: /Options menu/i,
      })
    );
    await waitForAsyncEvents();
    await act(async () => {
      jest.runAllTimers();
    });
    await userEvent.click(screen.getAllByRole('option')[0]);
    expect(onSelected).toHaveBeenCalled();
  });

  it('Integration recipients that have been previously used in the form are disabled', async () => {
    jest.useFakeTimers();
    const formikValues: Partial<BehaviorGroup> = {
      actions: [
        { integration: ref1, type: NotificationType.INTEGRATION },
      ] as ActionIntegration[],
    };

    render(
      <IntegrationRecipientTypeahead
        selected={undefined}
        integrationType={IntegrationType.WEBHOOK}
        onSelected={fn()}
      />,
      {
        wrapper: getConfiguredWrapper(undefined, formikValues),
      }
    );

    await waitForAsyncEvents();
    await userEvent.click(
      screen.getByRole('button', { name: /Options menu/i })
    );

    await waitForAsyncEvents();
    await act(async () => {
      jest.runAllTimers();
    });
    expect(
      screen.getAllByRole('option')[0].className.includes('disabled')
    ).toBeTruthy();
  });
});
