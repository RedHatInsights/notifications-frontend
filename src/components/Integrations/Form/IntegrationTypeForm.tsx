import * as React from 'react';
import { assertNever } from '@redhat-cloud-services/insights-common-typescript';

import { IntegrationType } from '../../../types/Integration';
import { IntegrationTypeHttpForm } from './IntegrationTypeHttpForm';

interface IntegrationTypeForm {
    type: IntegrationType;
}

export const IntegrationTypeForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {
    switch (props.type) {
        case IntegrationType.HTTP:
            return <IntegrationTypeHttpForm/>;
        default:
            assertNever(props.type);
    }
};
