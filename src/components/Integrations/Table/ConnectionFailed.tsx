import { AlertVariant } from '@patternfly/react-core';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { IntegrationConnectionAttempt } from '../../../types/Integration';
import { ConnectionAlert } from './ConnectionAlert';

interface ConnectionFailedProps {
  attempts: Array<IntegrationConnectionAttempt>;
}

const messages = defineMessages({
  failedConnectionTitle: {
    id: 'integrations.connectionFailed.title',
    defaultMessage: 'Failed connection',
  },
  failedConnectionDescription: {
    id: 'integrations.connectionFailed.description',
    defaultMessage: 'This connection has failed the most recent connection attempts.',
  },
});

export const ConnectionFailed: React.FunctionComponent<ConnectionFailedProps> = (props) => {
  const intl = useIntl();
  return (
    <ConnectionAlert
      attempts={props.attempts}
      alertVariant={AlertVariant.danger}
      description={intl.formatMessage(messages.failedConnectionDescription)}
      title={intl.formatMessage(messages.failedConnectionTitle)}
    />
  );
};
