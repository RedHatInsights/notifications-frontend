import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InProgressIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import { assertNever } from 'assert-never';
import * as React from 'react';

import { Schemas } from '../../generated/OpenapiNotifications';
import { Status } from '../Status/Status';
import { Icon } from '@patternfly/react-core';

interface NotificationStatusProps {
  status: Schemas.EventLogEntryActionStatus;
}

export const NotificationStatus: React.FunctionComponent<
  NotificationStatusProps
> = (props) => {
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

export const NotificationStatusFailed: React.FunctionComponent = () => (
  <Status text="Failure">
    <Icon status="danger">
      <ExclamationCircleIcon data-testid="fail-icon" />
    </Icon>
  </Status>
);

export const NotificationStatusUnknown: React.FunctionComponent = () => (
  <Status text="Unknown">
    <UnknownIcon data-testid="unknown-icon" />
  </Status>
);

export const NotificationStatusProcessing: React.FunctionComponent = () => (
  <Status text="Processing">
    <InProgressIcon data-testid="in-progress-icon" />
  </Status>
);

export const NotificationStatusSent: React.FunctionComponent = () => (
  <Status text="Sent">
    <Icon status="success">
      <CheckCircleIcon data-testid="success-icon" />
    </Icon>
  </Status>
);

export const NotificationStatusSuccess: React.FunctionComponent = () => (
  <Status text="Success">
    <Icon status="success">
      <CheckCircleIcon data-testid="success-icon" />
    </Icon>
  </Status>
);

export const NotificationStatusWarning: React.FunctionComponent = () => (
  <Status text="Warning">
    <Icon status="warning">
      <ExclamationTriangleIcon />
    </Icon>
  </Status>
);
