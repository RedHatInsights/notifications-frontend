import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';
import * as React from 'react';

import { IntegrationType, isCamelType, UserIntegrationType } from '../../../types/Integration';
import { IntegrationTypeCamelForm } from './IntegrationTypeCamelForm';
import { IntegrationTypeHttpForm } from './IntegrationTypeHttpForm';

export interface IntegrationTypeForm extends OuiaComponentProps {
    type: UserIntegrationType;
}

export const IntegrationTypeForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {

    if (isCamelType(props.type)) {
        return <IntegrationTypeCamelForm { ...props } />;
    }

    switch (props.type) {
        case IntegrationType.WEBHOOK:
            return <IntegrationTypeHttpForm { ...props } />;
        default:
            assertNever(props.type);
    }
};
