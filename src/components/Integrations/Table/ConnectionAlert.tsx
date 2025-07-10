import { Alert, AlertVariant } from '@patternfly/react-core';
import * as React from 'react';

import { IntegrationConnectionAttempt } from '../../../types/Integration';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { ConnectionAttempt, ConnectionAttemptType } from './ConnectionAttempt';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';

interface ConnectionAlertProps extends OuiaProps {
  attempts: Array<IntegrationConnectionAttempt>;
  alertVariant: AlertVariant;
  description: string;
  title: string;
}

export const ConnectionAlert: React.FunctionComponent<ConnectionAlertProps> = (
  props
) => {
  return (
    <div {...getOuiaProps('ConnectionAlert', props)}>
      <Alert title={props.title} variant={props.alertVariant} isInline>
        <p className="pf-v6-u-mt-sm">{props.description}</p>
        <p className="pf-v6-u-mt-sm">
          Last attempts:{' '}
          {props.attempts.map((attempt, index) => (
            <span key={index} className="pf-v6-u-ml-sm">
              <ConnectionAttempt
                type={
                  attempt.isSuccess
                    ? ConnectionAttemptType.SUCCESS
                    : ConnectionAttemptType.FAILED
                }
                date={attempt.date}
              />
            </span>
          ))}
        </p>
      </Alert>
    </div>
  );
};
