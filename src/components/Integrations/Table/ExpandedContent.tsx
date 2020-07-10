import * as React from 'react';
import { Integration } from '../../../types/Integration';
import {
    TextContent,
    TextList,
    TextListItem,
    TextListItemVariants,
    TextListVariants
} from '@patternfly/react-core';

interface ExpandedContentProps {
    integration: Integration;
}

export const ExpandedContent: React.FunctionComponent<ExpandedContentProps> = (props) => {
    return (
        <TextContent>
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
