import * as React from 'react';
import { ConnectionAlert } from './ConnectionAlert';
import { AlertVariant } from '@patternfly/react-core';
import { IntegrationConnectionAttempt } from '../../../types/Integration';

interface ConnectionFailedProps {
    attempts: Array<IntegrationConnectionAttempt>;
}

export const ConnectionFailed: React.FunctionComponent<ConnectionFailedProps> = (props) => {
    return <ConnectionAlert
        attempts={ props.attempts }
        alertVariant={ AlertVariant.danger }
        description="This connection has failed the most recent connection attempts."
        title="Failed connection"
    />;
};
