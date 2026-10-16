import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { AddNotificationBody } from '../../../components/Integrations/AddNotificationBody';
import { IntegrationSaveModal } from '../../../components/Integrations/SaveModal';
import { useSaveIntegrationMutation } from '../../../services/useSaveIntegration';
import { useSwitchIntegrationEnabledStatus } from '../../../services/useSwitchIntegrationEnabledStatus';
import { SavedNotificationScopeActions } from '../../../store/actions/SavedNotificationScopeAction';
import { savedNotificationScopeSelector } from '../../../store/selectors/SavedNotificationScopeSelector';
import { NotificationAppState } from '../../../store/types/NotificationAppState';
import {
  SavedNotificationScopeState,
  Status,
} from '../../../store/types/SavedNotificationScopeTypes';
import {
  Integration,
  NewUserIntegration,
  UserIntegration,
  UserIntegrationType,
} from '../../../types/Integration';
import { IntegrationRef } from '../../../types/Notification';
import { useNotification } from '../../../utils/AlertUtils';
import { ActionModalError } from '../../../utils/insights-common-typescript';

interface CreatePageProps {
  isEdit: boolean;
  initialIntegration: Partial<UserIntegration>;
  onClose: (saved: boolean) => void;
}

interface AddNotificationBodyContainer {
  integration: IntegrationRef;
  reduxDispatch: Dispatch;
  savedNotificationScope: SavedNotificationScopeState;
}

const messages = defineMessages({
  failedToUpdateTitle: {
    id: 'integrations.create.failedToUpdateTitle',
    defaultMessage: 'Integration failed to update',
  },
  failedToUpdateBody: {
    id: 'integrations.create.failedToUpdateBody',
    defaultMessage: 'There was an error trying to update the Integration. Please try again.',
  },
  failedToCreateTitle: {
    id: 'integrations.create.failedToCreateTitle',
    defaultMessage: 'Failed to create Integration',
  },
  failedToCreateBody: {
    id: 'integrations.create.failedToCreateBody',
    defaultMessage: 'There was an error trying to create the Integration. Please try again.',
  },
});

const AddNotificationBodyContainer: React.FunctionComponent<AddNotificationBodyContainer> = (
  props
) => {
  const switchIntegrationEnabledStatus = useSwitchIntegrationEnabledStatus();

  const onClick = React.useCallback((): void => {
    const reduxDispatch = props.reduxDispatch;
    const mutate = switchIntegrationEnabledStatus.mutate;
    const savedNotificationScope = props.savedNotificationScope;
    if (savedNotificationScope) {
      reduxDispatch(SavedNotificationScopeActions.start());
      const integration = savedNotificationScope.integration;
      mutate(integration).then((response) => {
        if (!response.error) {
          reduxDispatch(SavedNotificationScopeActions.finish(!integration.isEnabled));
        } else {
          reduxDispatch(SavedNotificationScopeActions.finish(integration.isEnabled));
        }
      });
    }
  }, [switchIntegrationEnabledStatus.mutate, props.reduxDispatch, props.savedNotificationScope]);

  React.useEffect(() => {
    const reduxDispatch = props.reduxDispatch;
    reduxDispatch(SavedNotificationScopeActions.setIntegration(props.integration));
    return () => {
      reduxDispatch(SavedNotificationScopeActions.unset());
    };
  }, [props.reduxDispatch, props.integration]);

  if (!props.savedNotificationScope) {
    return <React.Fragment />;
  }

  return (
    <AddNotificationBody
      integration={props.savedNotificationScope.integration}
      isLoading={props.savedNotificationScope.status === Status.LOADING}
      switchEnabled={onClick}
    />
  );
};

const ConnectedAddNotificationBodyContainer = connect(
  (state: NotificationAppState) => ({
    savedNotificationScope: savedNotificationScopeSelector(state),
  }),
  (dispatch) => ({
    reduxDispatch: dispatch,
  })
)(AddNotificationBodyContainer);

export const CreatePage: React.FunctionComponent<CreatePageProps> = (props) => {
  const intl = useIntl();
  const saveIntegrationMutation = useSaveIntegrationMutation();
  const [hasError, setError] = React.useState(false);
  const { addSuccessNotification } = useNotification();

  const onSaveIntegration = React.useCallback(
    (integration: NewUserIntegration) => {
      if (!integration.id) {
        integration.isEnabled = true;
      }

      setError(false);

      return saveIntegrationMutation.mutate(integration).then((response) => {
        if (response.payload?.status === 200) {
          const savedIntegration: IntegrationRef =
            response.payload?.type === 'Integration'
              ? {
                  ...(response.payload.value as Integration),
                  type: response.payload.value.type as unknown as UserIntegrationType,
                }
              : (integration as IntegrationRef);

          const title = props.isEdit
            ? `${savedIntegration.name} saved successfully`
            : `${savedIntegration.name} added successfully`;

          addSuccessNotification(
            title,
            <ConnectedAddNotificationBodyContainer integration={savedIntegration} />,
            true
          );

          return true;
        } else {
          setError(true);
          return false;
        }
      });
    },
    [saveIntegrationMutation, props.isEdit, addSuccessNotification]
  );

  const error = React.useMemo<ActionModalError | undefined>(() => {
    if (hasError) {
      if (props.isEdit) {
        return {
          title: intl.formatMessage(messages.failedToUpdateTitle),
          description: <p>{intl.formatMessage(messages.failedToUpdateBody)}</p>,
        };
      } else {
        return {
          title: intl.formatMessage(messages.failedToCreateTitle),
          description: <p>{intl.formatMessage(messages.failedToCreateBody)}</p>,
        };
      }
    }

    return undefined;
  }, [hasError, props.isEdit]);

  return (
    <IntegrationSaveModal
      initialIntegration={props.initialIntegration}
      onSave={onSaveIntegration}
      isEdit={props.isEdit}
      isSaving={saveIntegrationMutation.loading}
      onClose={props.onClose}
      error={error}
    />
  );
};
