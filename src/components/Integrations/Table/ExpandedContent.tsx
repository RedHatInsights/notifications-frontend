import * as React from 'react';
import { Integration } from '../../../types/Integration';
import {
    TextContent,
    TextList,
    TextListItem,
    TextListItemVariants,
    TextListVariants
} from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../../utils/getOuiaProps';

interface ExpandedContentProps extends OuiaComponentProps {
    integration: Integration;
}

export const ExpandedContent: React.FunctionComponent<ExpandedContentProps> = (props) => {
    return (
        <TextContent { ...getOuiaProps('Integrations/Table/ExpandedContent', props) }>
            <TextList component={ TextListVariants.dl }>
                <TextListItem component={ TextListItemVariants.dt }>
                    Webhook URL
                </TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>
                    { props.integration.url }
                </TextListItem>
            </TextList>
        </TextContent>
    );
};
