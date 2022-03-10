import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { IntegrationCamel, IntegrationType, TypedIntegration, UserIntegrationType } from '../../../types/Integration';
import { IntegrationExpandedContent } from './ExpandedContent/IntegrationExpandedContent';
import { SlackExpandedContent } from './ExpandedContent/SlackExpandedContent';

export const expandedContentTitleClass = style({
    fontWeight: 400
});

export interface ExpandedContentProps<T extends IntegrationType> extends OuiaComponentProps {
    integration: TypedIntegration<T>;
}

export const ExpandedContent: React.FunctionComponent<ExpandedContentProps<UserIntegrationType>> = (props) => {
    if (props.integration.type === IntegrationType.SLACK) {
        return <SlackExpandedContent integration={ props.integration as IntegrationCamel } />;
    }

    return <IntegrationExpandedContent { ...props } />;
};
