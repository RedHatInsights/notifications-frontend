import { Alert, AlertVariant } from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { IntegrationConnectionAttempt } from '../../../types/Integration';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { ConnectionAttempt, ConnectionAttemptType } from './ConnectionAttempt';

interface ConnectionAlertProps extends OuiaComponentProps {
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
        <p className="pf-v5-u-mt-sm">{props.description}</p>
        <p className="pf-v5-u-mt-sm">
          Last attempts:{' '}
          {props.attempts.map((attempt, index) => (
            <span key={index} className="pf-v5-u-ml-sm">
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
