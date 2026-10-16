import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { DOCUMENTATION_URL, OPEN_CASE_URL } from './Constants';

const messages = defineMessages({
  successTitle: {
    id: 'integrations.splunkSetup.finished.successTitle',
    defaultMessage: 'Splunk integration in Insights completed',
  },
  successBody: {
    id: 'integrations.splunkSetup.finished.successBody',
    defaultMessage:
      'Splunk integration in Insights was completed. To confirm these changes, {goBackToSplunk}.',
  },
  goBackToSplunk: {
    id: 'integrations.splunkSetup.finished.goBackToSplunk',
    defaultMessage: 'go back to Splunk application',
  },
  failureTitle: {
    id: 'integrations.splunkSetup.finished.failureTitle',
    defaultMessage: 'Configuration failed',
  },
  failureBody: {
    id: 'integrations.splunkSetup.finished.failureBody',
    defaultMessage:
      'There was a problem processing the request. Please try again. If the problem persists, contact Red Hat support by opening the ticket.',
  },
  openTicket: {
    id: 'integrations.splunkSetup.finished.openTicket',
    defaultMessage: 'Open a Red Hat Support ticket',
  },
  goToDocumentation: {
    id: 'integrations.splunkSetup.finished.goToDocumentation',
    defaultMessage: 'Go to documentation',
  },
});

const BOLD_GO_BACK_TO_SPLUNK = <strong>go back to Splunk application</strong>;

interface SplunkSetupFinishedProps {
  isSuccess: boolean;
  error: Error | undefined;
}

export const SplunkSetupFinished: React.FunctionComponent<SplunkSetupFinishedProps> = ({
  isSuccess,
  error,
}) => (isSuccess ? <SplunkSetupFinishedSuccess /> : <SplunkSetupFinishedFailure error={error} />);

export const SplunkSetupFinishedSuccess: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <EmptyState
      headingLevel="h4"
      icon={CheckCircleIcon}
      titleText={intl.formatMessage(messages.successTitle)}
    >
      <EmptyStateBody>
        <FormattedMessage
          {...messages.successBody}
          values={{ goBackToSplunk: BOLD_GO_BACK_TO_SPLUNK }}
        />
      </EmptyStateBody>
    </EmptyState>
  );
};

export const SplunkSetupFinishedFailure: React.FunctionComponent<{
  error: Error | undefined;
}> = ({ error }) => {
  const intl = useIntl();
  return (
    <EmptyState
      headingLevel="h4"
      icon={ExclamationCircleIcon}
      titleText={intl.formatMessage(messages.failureTitle)}
    >
      <EmptyStateBody>
        <p className="pf-v6-u-mb-md">{intl.formatMessage(messages.failureBody)}</p>
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
          {intl.formatMessage(messages.openTicket)}
        </Button>
        <EmptyStateActions>
          <Button
            variant="link"
            component="a"
            href={DOCUMENTATION_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {intl.formatMessage(messages.goToDocumentation)}
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};
