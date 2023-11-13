import { AlertVariant } from '@patternfly/react-core';
import * as React from 'react';

import { IntegrationConnectionAttempt } from '../../../types/Integration';
import { ConnectionAlert } from './ConnectionAlert';

interface ConnectionDegradedProps {
  attempts: Array<IntegrationConnectionAttempt>;
}

export const ConnectionDegraded: React.FunctionComponent<ConnectionDegradedProps> =
  (props) => {
    const description = React.useMemo(() => {
      const failures = props.attempts.filter((a) => !a.isSuccess).length;
      const attempts = props.attempts.length;

      if (failures === 1) {
        return `This connection has had 1 failure in the last ${attempts} connection attempts.`;
      }

      return `This connection has had ${failures} failures in the last ${attempts} connection attempts.`;
    }, [props.attempts]);

    return (
      <ConnectionAlert
        attempts={props.attempts}
        alertVariant={AlertVariant.warning}
        description={description}
        title="Connection is degraded"
      />
    );
  };
