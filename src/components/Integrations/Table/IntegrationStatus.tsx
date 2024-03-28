import { Icon, Popover, Skeleton } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import React from 'react';

import {
  Integration,
  IntegrationConnectionAttempt,
} from '../../../types/Integration';
import {
  AggregatedConnectionAttemptStatus,
  aggregateConnectionAttemptStatus,
} from '../../../utils/ConnectionAttemptStatus';
import { Degraded, DegradedProps } from '../../Status/Degraded';
import { Status } from '../../Status/Status';

export interface IntegrationStatusProps {
  status: Integration['status'];
  lastConnectionAttempts: Array<IntegrationConnectionAttempt> | undefined;
  includeDetails: boolean;
}

export interface StatusCreationFailureProps {
  includeDetails: boolean;
}

export const IntegrationStatus: React.FunctionComponent<
  IntegrationStatusProps
> = (props) => {
  const status = props.status ?? 'UNKNOWN';
  if (
    status === 'FAILED' ||
    status === 'PROVISIONING' ||
    status === 'DELETING'
  ) {
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
  if (
    aggregatedConnectionAttemptStatus ===
    AggregatedConnectionAttemptStatus.UNKNOWN
  ) {
    return <StatusReady />;
  }

  const lastConnectionAttemptStatus = props.lastConnectionAttempts[0].isSuccess;
  const isDegraded =
    aggregatedConnectionAttemptStatus ===
    AggregatedConnectionAttemptStatus.WARNING;
  if (lastConnectionAttemptStatus) {
    return <StatusSuccess isDegraded={isDegraded} />;
  } else {
    return <StatusEventFailure isDegraded={isDegraded} />;
  }
};

export const StatusSuccess: React.FunctionComponent<DegradedProps> = (
  props
) => (
  <Degraded isDegraded={props.isDegraded}>
    <Status text="Success">
      <Icon status="success">
        <CheckCircleIcon data-testid="success-icon" />
      </Icon>{' '}
    </Status>
  </Degraded>
);

export const StatusEventFailure: React.FunctionComponent<DegradedProps> = (
  props
) => (
  <Degraded isDegraded={props.isDegraded}>
    <Status text="Event failure">
      <Icon status="danger">
        <ExclamationCircleIcon data-testid="fail-icon" />
      </Icon>{' '}
    </Status>
  </Degraded>
);

export const StatusReady: React.FunctionComponent<unknown> = () => (
  <Status text="Ready">
    <Icon status="success">
      <CheckCircleIcon data-testid="success-icon" />
    </Icon>{' '}
  </Status>
);

export const StatusCreationFailure: React.FunctionComponent<
  StatusCreationFailureProps
> = (props) => (
  <Popover
    aria-label="Basic popover"
    headerContent={<div>Failed connection</div>}
    bodyContent={props.includeDetails}
  >
    <Status text="Creation failure">
      <Icon status="danger">
        <ExclamationCircleIcon data-testid="fail-icon" />
      </Icon>{' '}
    </Status>
  </Popover>
);

export const StatusProcessing: React.FunctionComponent<unknown> = () => (
  <Status text="Processing">
    <InProgressIcon data-testid="in-progress-icon" />{' '}
  </Status>
);

export const StatusUnknown: React.FunctionComponent<unknown> = () => (
  <Status text="Error loading status">
    <UnknownIcon data-testid="unknown-icon" />{' '}
  </Status>
);
