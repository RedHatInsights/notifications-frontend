import { Skeleton } from '@patternfly/react-core';
import React from 'react';

import { Integration, IntegrationConnectionAttempt } from '../../../types/Integration';
import { aggregateConnectionAttemptStatus, AggregatedConnectionAttemptStatus } from '../../../utils/ConnectionAttemptStatus';
import { StatusCreationFailure, StatusEventFailure, StatusProcessing, StatusReady, StatusSuccess } from './Status';

export interface IntegrationStatusProps {
    status: Integration['status'];
    lastConnectionAttempts: Array<IntegrationConnectionAttempt> | undefined;
}

export const IntegrationStatus: React.FunctionComponent<IntegrationStatusProps> = props => {
    const status = props.status ?? 'UNKNOWN';
    if (status === 'FAILED' || status === 'PROVISIONING' || status === 'DELETING') {
        switch (status) {
            case 'FAILED':
                return <StatusCreationFailure />;
            case 'DELETING':
            case 'PROVISIONING':
                return <StatusProcessing />;
        }
    }

    if (!props.lastConnectionAttempts) {
        return <Skeleton data-testid="skeleton-loading" width="80%" />;
    }

    const aggregatedConnectionAttemptStatus = aggregateConnectionAttemptStatus(props.lastConnectionAttempts);

    // No attempts found
    if (aggregatedConnectionAttemptStatus === AggregatedConnectionAttemptStatus.UNKNOWN) {
        return <StatusReady />;
    }

    const lastConnectionAttemptStatus = props.lastConnectionAttempts[0].isSuccess;
    const isDegraded = aggregatedConnectionAttemptStatus === AggregatedConnectionAttemptStatus.WARNING;
    if (lastConnectionAttemptStatus) {
        return <StatusSuccess isDegraded={ isDegraded } />;
    } else {
        return <StatusEventFailure isDegraded={ isDegraded } />;
    }
};
