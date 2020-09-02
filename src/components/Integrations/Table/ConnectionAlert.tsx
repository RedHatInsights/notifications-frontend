import * as React from 'react';
import { Alert, AlertVariant } from '@patternfly/react-core';
import { ConnectionAttempt, ConnectionAttemptType } from './ConnectionAttempt';
import { style } from 'typestyle';
import { Spacer } from '@redhat-cloud-services/insights-common-typescript';
import { IntegrationConnectionAttempt } from '../../../types/Integration';

interface ConnectionAlertProps {
    attempts: Array<IntegrationConnectionAttempt>;
    alertVariant: AlertVariant;
    description: string;
    title: string;
}

const connectionAttemptClassName = style({
    marginLeft: Spacer.SM
});

const marginTopClassName = style({
    marginTop: Spacer.SM
});

export const ConnectionAlert: React.FunctionComponent<ConnectionAlertProps> = (props) => {
    return (
        <Alert title={ props.title } variant={ props.alertVariant } isInline>
            <p className={ marginTopClassName }>
                { props.description }
            </p>
            <p className={ marginTopClassName }>
                Last attempts: { props.attempts.map(
                    (attempt, index) =>
                        <span key={ index } className={ connectionAttemptClassName }>
                            <ConnectionAttempt
                                type={ attempt.isSuccess ? ConnectionAttemptType.SUCCESS : ConnectionAttemptType.FAILED }
                                date={ attempt.date }
                            />
                        </span>
                ) }
            </p>
        </Alert>
    );
};
