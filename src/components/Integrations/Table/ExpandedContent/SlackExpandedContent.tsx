import { TextContent, TextList, TextListItem, TextListItemVariants, TextListVariants } from '@patternfly/react-core';
import * as React from 'react';

import { CamelIntegrationType } from '../../../../types/Integration';
import { getOuiaProps } from '../../../../utils/getOuiaProps';
import { ExpandedContentProps, expandedContentTitleClass } from '../ExpandedContent';

export const SlackExpandedContent: React.FunctionComponent<ExpandedContentProps<CamelIntegrationType>> = (props) => {
    const channel = props.integration.extras?.channel;

    return (
        <TextContent { ...getOuiaProps('Integrations/Table/SlackExpandedContent', props) }>
            <TextList component={ TextListVariants.dl }>
                <TextListItem className={ expandedContentTitleClass } component={ TextListItemVariants.dt }>
                    Endpoint URL
                </TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>
                    { props.integration.url }
                </TextListItem>
                <TextListItem className={ expandedContentTitleClass } component={ TextListItemVariants.dt }>
                    Channel
                </TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>
                    { channel ?? ''  }
                </TextListItem>
            </TextList>
        </TextContent>
    );
};
