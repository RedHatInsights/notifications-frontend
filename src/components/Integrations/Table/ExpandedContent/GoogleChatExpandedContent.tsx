import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
} from '@patternfly/react-core';
import * as React from 'react';

import { CamelIntegrationType } from '../../../../types/Integration';
import { getOuiaProps } from '../../../../utils/getOuiaProps';
import {
  ExpandedContentProps,
  expandedContentTitleClass,
} from '../ExpandedContent';

export const GoogleChatExpandedContent: React.FunctionComponent<
  ExpandedContentProps<CamelIntegrationType>
> = (props) => {
  return (
    <TextContent
      {...getOuiaProps('Integrations/Table/GoogleChatExpandedContent', props)}
    >
      <TextList component={TextListVariants.dl}>
        <TextListItem
          className={expandedContentTitleClass}
          component={TextListItemVariants.dt}
        >
          Endpoint URL
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>
          {props.integration.url}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};
