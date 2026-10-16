import { Spinner } from '@patternfly/react-core';
import { EnvelopeIcon } from '@patternfly/react-icons';
import BellIcon from '@patternfly/react-icons/dist/js/icons/bell-icon';
import { assertNever } from 'assert-never';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import Config from '../../config/Config';
import { Action, NotificationType } from '../../types/Notification';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { WebhookIcon } from '../Icons/WebhookIcon';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';

const messages = defineMessages({
  errorLoading: {
    id: 'notifications.actionComponent.errorLoading',
    defaultMessage: 'Error loading actions',
  },
  noActions: {
    id: 'notifications.actionComponent.noActions',
    defaultMessage: 'No actions.',
  },
  usersNotNotified: {
    id: 'notifications.actionComponent.usersNotNotified',
    defaultMessage: 'Users will not be notified.',
  },
});

const COLON_SEPARATOR = ': ';

export interface ActionComponentText extends OuiaProps {
  action: Action | undefined;
  loading?: boolean;
  hasError?: boolean;
}

interface ActionTypeToIconProps {
  actionType: NotificationType;
}

const ActionTypeToIcon: React.FunctionComponent<ActionTypeToIconProps> = (props) => {
  switch (props.actionType) {
    case NotificationType.DRAWER:
      return <BellIcon />;
    case NotificationType.EMAIL_SUBSCRIPTION:
      return <EnvelopeIcon />;
    case NotificationType.INTEGRATION:
      return <WebhookIcon />;
    default:
      assertNever(props.actionType);
  }
};

const ActionComponentWrapper: React.FunctionComponent<
  React.PropsWithChildren<ActionComponentText>
> = (props) => (
  <div {...getOuiaProps('Notifications/ActionComponent', props)}>{props.children}</div>
);

export const ActionComponent: React.FunctionComponent<ActionComponentText> = (props) => {
  const intl = useIntl();

  if (props.loading) {
    return (
      <ActionComponentWrapper {...props}>
        <Spinner size="md" />
      </ActionComponentWrapper>
    );
  }

  if (props.hasError) {
    return (
      <ActionComponentWrapper {...props}>
        <span>{intl.formatMessage(messages.errorLoading)}</span>
      </ActionComponentWrapper>
    );
  }

  if (!props.action) {
    return (
      <ActionComponentWrapper {...props}>
        <span className="pf-v6-u-text-color-subtle">
          <div>{intl.formatMessage(messages.noActions)}</div>
          <div>{intl.formatMessage(messages.usersNotNotified)}</div>
        </span>
      </ActionComponentWrapper>
    );
  }

  return (
    <ActionComponentWrapper {...props}>
      <ActionTypeToIcon actionType={props.action.type} />
      <span className="pf-v6-u-ml-sm">{Config.notifications.types[props.action.type].name}</span>
      {props.action.type === NotificationType.INTEGRATION && (
        <span>
          {COLON_SEPARATOR}
          {Config.integrations.types[props.action.integration.type].name}
        </span>
      )}
    </ActionComponentWrapper>
  );
};
