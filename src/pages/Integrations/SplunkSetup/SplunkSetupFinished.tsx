import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
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

export const SplunkSetupFinished: React.FunctionComponent<
  SplunkSetupFinishedProps
> = ({ isSuccess, error }) =>
  isSuccess ? (
    <SplunkSetupFinishedSuccess />
  ) : (
    <SplunkSetupFinishedFailure error={error} />
  );

export const SplunkSetupFinishedSuccess: React.FunctionComponent = () => (
  <EmptyState
    headingLevel="h4"
    icon={CheckCircleIcon}
    titleText="Splunk integration in Insights completed"
  >
    <EmptyStateBody>
      Splunk integration in Insights was completed. To confirm these changes,{' '}
      <strong>go back to Splunk application</strong>.
    </EmptyStateBody>
  </EmptyState>
);

export const SplunkSetupFinishedFailure: React.FunctionComponent<{
  error: Error | undefined;
}> = ({ error }) => (
  <EmptyState
    headingLevel="h4"
    icon={ExclamationCircleIcon}
    titleText="Configuration failed"
  >
    <EmptyStateBody>
      <p className="pf-v5-u-mb-md">
        There was a problem processing the request. Please try again. If the
        problem persists, contact Red Hat support by opening the ticket.
      </p>
      {error && <p>{`${error}`}</p>}
    </EmptyStateBody>
    <EmptyStateFooter>
      <Button
        variant="primary"
        component="a"
        href={OPEN_CASE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open a Red Hat Support ticket
      </Button>
      <EmptyStateActions>
        <Button
          variant="link"
          component="a"
          href={DOCUMENTATION_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to documentation
        </Button>
      </EmptyStateActions>
    </EmptyStateFooter>
  </EmptyState>
);
