import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
} from '@patternfly/react-core';
import * as React from 'react';
import { UserIntegrationType } from '../../../../types/Integration';
import { getOuiaProps } from '../../../../utils/getOuiaProps';
import {
  ExpandedContentProps,
  expandedContentTitleClass,
} from '../ExpandedContent';

export const PagerDutyExpandedContent: React.FunctionComponent<
  ExpandedContentProps<UserIntegrationType>
> = (props) => {
  return (
    <TextContent
      {...getOuiaProps('Integrations/Table/PagerDutyExpandedContent', props)}
    >
      <TextList component={TextListVariants.dl}>
        {'secretToken' in props.integration && (
          <>
            <TextListItem
              className={expandedContentTitleClass}
              component={TextListItemVariants.dt}
            >
              Integration Key
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {props.integration.secretToken !== undefined
                ? 'Secret token'
                : 'None'}
            </TextListItem>
          </>
        )}
        {props.integration['severity'] && (
          <>
            <TextListItem
              className={expandedContentTitleClass}
              component={TextListItemVariants.dt}
            >
              Severity
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {props.integration['severity']}
            </TextListItem>
          </>
        )}
      </TextList>
    </TextContent>
  );
};
