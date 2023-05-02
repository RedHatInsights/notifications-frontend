import { TextContent, TextList, TextListItem, TextListItemVariants, TextListVariants } from '@patternfly/react-core';
import * as React from 'react';

import { UserIntegrationType } from '../../../../types/Integration';
import { getOuiaProps } from '../../../../utils/getOuiaProps';
import { ExpandedContentProps, expandedContentTitleClass } from '../ExpandedContent';

export const IntegrationExpandedContent: React.FunctionComponent<ExpandedContentProps<UserIntegrationType>> = (props) => {
    return (
        <TextContent { ...getOuiaProps('Integrations/Table/IntegrationExpandedContent', props) }>
            <TextList component={ TextListVariants.dl }>
                <TextListItem className={ expandedContentTitleClass } component={ TextListItemVariants.dt }>
                    Endpoint URL
                </TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>
                    { props.integration.url }
                </TextListItem>
                <TextListItem className={ expandedContentTitleClass } component={ TextListItemVariants.dt }>
                    SSL verification
                </TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>
                    { props.integration.sslVerificationEnabled ? 'Enabled' : 'Disabled' }
                </TextListItem>
                { 'secretToken' in props.integration &&
                    <>
                        <TextListItem className={ expandedContentTitleClass } component={ TextListItemVariants.dt }>
                            Authentication type
                        </TextListItem>
                        <TextListItem component={ TextListItemVariants.dd }>
                            { props.integration.secretToken !== undefined ? 'Secret token' : 'None' }
                        </TextListItem>
                    </>
                }
            </TextList>
        </TextContent>
    );
};
