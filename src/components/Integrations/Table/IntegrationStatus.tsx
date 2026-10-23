import { Icon, Popover, Skeleton } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Integration, IntegrationConnectionAttempt } from '../../../types/Integration';
import {
  AggregatedConnectionAttemptStatus,
  aggregateConnectionAttemptStatus,
} from '../../../utils/ConnectionAttemptStatus';
import { Degraded, DegradedProps } from '../../Status/Degraded';
import { Status } from '../../Status/Status';

const messages = defineMessages({
  success: {
    id: 'integrations.status.success',
    defaultMessage: 'Success',
  },
  eventFailure: {
    id: 'integrations.status.eventFailure',
    defaultMessage: 'Event failure',
  },
  ready: {
    id: 'integrations.status.ready',
    defaultMessage: 'Ready',
  },
  popoverAria: {
    id: 'integrations.status.popoverAria',
    defaultMessage: 'Connection status details',
  },
  failedConnection: {
    id: 'integrations.status.failedConnection',
    defaultMessage: 'Failed connection',
  },
  creationFailure: {
    id: 'integrations.status.creationFailure',
    defaultMessage: 'Creation failure',
  },
  processing: {
    id: 'integrations.status.processing',
    defaultMessage: 'Processing',
  },
  errorLoadingStatus: {
    id: 'integrations.status.errorLoadingStatus',
    defaultMessage: 'Error loading status',
  },
});

export interface IntegrationStatusProps {
  status: Integration['status'];
  lastConnectionAttempts: Array<IntegrationConnectionAttempt> | undefined;
  includeDetails: boolean;
}

export interface StatusCreationFailureProps {
  includeDetails: boolean;
}

export const IntegrationStatus: React.FunctionComponent<IntegrationStatusProps> = (props) => {
  const status = props.status ?? 'UNKNOWN';
  if (status === 'FAILED' || status === 'PROVISIONING' || status === 'DELETING') {
    switch (status) {
      case 'FAILED':
        return <StatusCreationFailure includeDetails={props.includeDetails} />;
      case 'DELETING':
      case 'PROVISIONING':
        return <StatusProcessing />;
    }
  }

  if (!props.lastConnectionAttempts) {
    return <Skeleton data-testid="skeleton-loading" width="80%" />;
  }

  const aggregatedConnectionAttemptStatus = aggregateConnectionAttemptStatus(
    props.lastConnectionAttempts
  );

  // No attempts found
  if (aggregatedConnectionAttemptStatus === AggregatedConnectionAttemptStatus.UNKNOWN) {
    return <StatusReady />;
  }

  const lastConnectionAttemptStatus = props.lastConnectionAttempts[0].isSuccess;
  const isDegraded =
    aggregatedConnectionAttemptStatus === AggregatedConnectionAttemptStatus.WARNING;
  if (lastConnectionAttemptStatus) {
    return <StatusSuccess isDegraded={isDegraded} />;
  } else {
    return <StatusEventFailure isDegraded={isDegraded} />;
  }
};

export const StatusSuccess: React.FunctionComponent<DegradedProps> = (props) => {
  const intl = useIntl();
  return (
    <Degraded isDegraded={props.isDegraded}>
      <Status text={intl.formatMessage(messages.success)}>
        <Icon status="success">
          <CheckCircleIcon data-testid="success-icon" />
        </Icon>{' '}
      </Status>
    </Degraded>
  );
};

export const StatusEventFailure: React.FunctionComponent<DegradedProps> = (props) => {
  const intl = useIntl();
  return (
    <Degraded isDegraded={props.isDegraded}>
      <Status text={intl.formatMessage(messages.eventFailure)}>
        <Icon status="danger">
          <ExclamationCircleIcon data-testid="fail-icon" />
        </Icon>{' '}
      </Status>
    </Degraded>
  );
};

export const StatusReady: React.FunctionComponent<unknown> = () => {
  const intl = useIntl();
  return (
    <Status text={intl.formatMessage(messages.ready)}>
      <Icon status="success">
        <CheckCircleIcon data-testid="success-icon" />
      </Icon>{' '}
    </Status>
  );
};

export const StatusCreationFailure: React.FunctionComponent<StatusCreationFailureProps> = (
  props
) => {
  const intl = useIntl();
  return (
    <Popover
      aria-label={intl.formatMessage(messages.popoverAria)}
      headerContent={<div>{intl.formatMessage(messages.failedConnection)}</div>}
      bodyContent={props.includeDetails}
    >
      <Status text={intl.formatMessage(messages.creationFailure)}>
        <Icon status="danger">
          <ExclamationCircleIcon data-testid="fail-icon" />
        </Icon>{' '}
      </Status>
    </Popover>
  );
};

export const StatusProcessing: React.FunctionComponent<unknown> = () => {
  const intl = useIntl();
  return (
    <Status text={intl.formatMessage(messages.processing)}>
      <InProgressIcon data-testid="in-progress-icon" />{' '}
    </Status>
  );
};

export const StatusUnknown: React.FunctionComponent<unknown> = () => {
  const intl = useIntl();
  return (
    <Status text={intl.formatMessage(messages.errorLoadingStatus)}>
      <UnknownIcon data-testid="unknown-icon" />{' '}
    </Status>
  );
};
