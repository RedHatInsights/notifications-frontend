import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InProgressIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import { assertNever } from 'assert-never';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Schemas } from '../../generated/OpenapiNotifications';
import { Status } from '../Status/Status';
import { Icon } from '@patternfly/react-core';

const messages = defineMessages({
  failure: {
    id: 'notifications.status.failure',
    defaultMessage: 'Failure',
  },
  unknown: {
    id: 'notifications.status.unknown',
    defaultMessage: 'Unknown',
  },
  processing: {
    id: 'notifications.status.processing',
    defaultMessage: 'Processing',
  },
  sent: {
    id: 'notifications.status.sent',
    defaultMessage: 'Sent',
  },
  success: {
    id: 'notifications.status.success',
    defaultMessage: 'Success',
  },
  warning: {
    id: 'notifications.status.warning',
    defaultMessage: 'Warning',
  },
});

interface NotificationStatusProps {
  status: Schemas.EventLogEntryActionStatus;
}

export const NotificationStatus: React.FunctionComponent<NotificationStatusProps> = (props) => {
  switch (props.status) {
    case 'FAILED':
      return <NotificationStatusFailed />;
    case 'PROCESSING':
      return <NotificationStatusProcessing />;
    case 'SENT':
      return <NotificationStatusSent />;
    case 'SUCCESS':
      return <NotificationStatusSuccess />;
    case 'UNKNOWN':
      return <NotificationStatusUnknown />;
    default:
      assertNever(props.status);
  }
};

export const NotificationStatusFailed: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <Status text={intl.formatMessage(messages.failure)}>
      <Icon status="danger">
        <ExclamationCircleIcon data-testid="fail-icon" />
      </Icon>
    </Status>
  );
};

export const NotificationStatusUnknown: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <Status text={intl.formatMessage(messages.unknown)}>
      <UnknownIcon data-testid="unknown-icon" />
    </Status>
  );
};

export const NotificationStatusProcessing: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <Status text={intl.formatMessage(messages.processing)}>
      <InProgressIcon data-testid="in-progress-icon" />
    </Status>
  );
};

export const NotificationStatusSent: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <Status text={intl.formatMessage(messages.sent)}>
      <Icon status="success">
        <CheckCircleIcon data-testid="success-icon" />
      </Icon>
    </Status>
  );
};

export const NotificationStatusSuccess: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <Status text={intl.formatMessage(messages.success)}>
      <Icon status="success">
        <CheckCircleIcon data-testid="success-icon" />
      </Icon>
    </Status>
  );
};

export const NotificationStatusWarning: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <Status text={intl.formatMessage(messages.warning)}>
      <Icon status="warning">
        <ExclamationTriangleIcon />
      </Icon>
    </Status>
  );
};
