import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Title,
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import React from 'react';

import { DOCUMENTATION_URL, OPEN_CASE_URL } from './Constants';

interface SplunkSetupFinishedProps {
  isSuccess: boolean;
  error: Error | undefined;
}

export const SplunkSetupFinished: React.FunctionComponent<SplunkSetupFinishedProps> =
  ({ isSuccess, error }) =>
    isSuccess ? (
      <SplunkSetupFinishedSuccess />
    ) : (
      <SplunkSetupFinishedFailure error={error} />
    );

export const SplunkSetupFinishedSuccess: React.FunctionComponent = () => (
  <EmptyState>
    <EmptyStateIcon
      icon={CheckCircleIcon}
      color="var(--pf-global--success-color--100)"
    />
    <Title headingLevel="h4" size="lg">
      Splunk integration in Insights completed
    </Title>
    <EmptyStateBody>
      Splunk integration in Insights was completed. To confirm these changes,{' '}
      <strong>go back to Splunk application</strong>.
    </EmptyStateBody>
  </EmptyState>
);

export const SplunkSetupFinishedFailure: React.FunctionComponent<{
  error: Error | undefined;
}> = ({ error }) => (
  <EmptyState>
    <EmptyStateIcon
      icon={ExclamationCircleIcon}
      color="var(--pf-global--danger-color--100)"
    />
    <Title headingLevel="h4" size="lg">
      Configuration failed
    </Title>
    <EmptyStateBody>
      <p className="pf-u-mb-md">
        There was a problem processing the request. Please try again. If the
        problem persists, contact Red Hat support by opening the ticket.
      </p>
      {error && <p>{`${error}`}</p>}
    </EmptyStateBody>
    <Button
      variant="primary"
      component="a"
      href={OPEN_CASE_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open a Red Hat Support ticket
    </Button>
    <EmptyStateSecondaryActions>
      <Button
        variant="link"
        component="a"
        href={DOCUMENTATION_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Go to documentation
      </Button>
    </EmptyStateSecondaryActions>
  </EmptyState>
);
