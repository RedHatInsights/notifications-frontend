import {
    Button,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    Title
} from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import React, { Dispatch, SetStateAction } from 'react';

interface SplunkSetupFinishedProps {
  setStep: Dispatch<SetStateAction<number>>;
}

export const SplunkSetupFinished: React.FunctionComponent<SplunkSetupFinishedProps> = ({ setStep }) => (
    <EmptyState>
        <EmptyStateIcon icon={ CheckCircleIcon } color='var(--pf-global--success-color--200)' />
        <Title headingLevel="h4" size="lg">
        Splunk integration in Insights completed
        </Title>
        <EmptyStateBody>
        Splunk integration in Insights was completed. To confirm these changes, go back to Splunk application.
        </EmptyStateBody>
        <Button variant="primary" onClick={ () => setStep(prevStep => prevStep - 1) }>Go back to Splunk application</Button>
    </EmptyState>
);
