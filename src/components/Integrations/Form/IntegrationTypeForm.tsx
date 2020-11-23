import * as React from 'react';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { assertNever } from 'assert-never';

import { UserIntegrationType } from '../../../types/Integration';
import { IntegrationTypeHttpForm } from './IntegrationTypeHttpForm';

export interface IntegrationTypeForm extends OuiaComponentProps {
    type: UserIntegrationType;
}

export const IntegrationTypeForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {
    switch (props.type) {
        case UserIntegrationType.WEBHOOK:
            return <IntegrationTypeHttpForm { ...props }/>;
        default:
            assertNever(props.type);
    }
};
