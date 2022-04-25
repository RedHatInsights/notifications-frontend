import {
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    Title
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import React from 'react';

export const SplunkSetupFinished: React.FunctionComponent = () => (
    <EmptyState>
        <EmptyStateIcon icon={ CheckCircleIcon } color='var(--pf-global--success-color--100)' />
        <Title headingLevel="h4" size="lg">
        Splunk integration in Insights completed
        </Title>
        <EmptyStateBody>
        Splunk integration in Insights was completed.
        To confirm these changes, <strong>go back to Splunk application</strong>.
        </EmptyStateBody>
    </EmptyState>
);
