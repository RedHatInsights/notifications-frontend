import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';
import * as React from 'react';

import { IntegrationType, UserIntegrationType } from '../../../types/Integration';
import { IntegrationTypeCamelForm } from './IntegrationTypeCamelForm';
import { IntegrationTypeHttpForm } from './IntegrationTypeHttpForm';

export interface IntegrationTypeForm extends OuiaComponentProps {
    type: UserIntegrationType;
}

export const IntegrationTypeForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {
    switch (props.type) {
        case IntegrationType.WEBHOOK:
            return <IntegrationTypeHttpForm { ...props } />;
        case IntegrationType.SPLUNK: // Todo: Make it easier to add types
        case IntegrationType.ANYCAMEL:
            return <IntegrationTypeCamelForm { ...props } />;
        default:
            assertNever(props.type);
    }
};
