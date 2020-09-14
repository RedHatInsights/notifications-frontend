import * as React from 'react';
import { Integration } from '../../../types/Integration';
import { TextContent, TextList, TextListItem, TextListItemVariants, TextListVariants } from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { style } from 'typestyle';

const titleClass = style({
    fontWeight: 400
});

interface ExpandedContentProps extends OuiaComponentProps {
    integration: Integration;
}

export const ExpandedContent: React.FunctionComponent<ExpandedContentProps> = (props) => {
    return (
        <TextContent { ...getOuiaProps('Integrations/Table/ExpandedContent', props) }>
            <TextList component={ TextListVariants.dl }>
                <TextListItem className={ titleClass } component={ TextListItemVariants.dt }>
                    Endpoint URL
                </TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>
                    { props.integration.url }
                </TextListItem>
                <TextListItem className={ titleClass } component={ TextListItemVariants.dt }>
                    SSL verification
                </TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>
                    { props.integration.sslVerificationEnabled ? 'Enabled' : 'Disabled' }
                </TextListItem>
                <TextListItem className={ titleClass } component={ TextListItemVariants.dt }>
                    Authentication type
                </TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>
                    { props.integration.secretToken !== undefined ? 'Secret token' : 'None' }
                </TextListItem>
            </TextList>
        </TextContent>
    );
};
