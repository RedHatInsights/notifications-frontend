import { Content, ContentVariants } from '@patternfly/react-core';
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
    <Content
      {...getOuiaProps('Integrations/Table/PagerDutyExpandedContent', props)}
    >
      <Content component={ContentVariants.dl}>
        {'secretToken' in props.integration && (
          <>
            <Content
              className={expandedContentTitleClass}
              component={ContentVariants.dt}
            >
              Integration Key
            </Content>
            <Content component={ContentVariants.dd}>
              {props.integration.secretToken !== undefined
                ? 'Secret token'
                : 'None'}
            </Content>
          </>
        )}
        {props.integration['severity'] && (
          <>
            <Content
              className={expandedContentTitleClass}
              component={ContentVariants.dt}
            >
              Severity
            </Content>
            <Content component={ContentVariants.dd}>
              {props.integration['severity']}
            </Content>
          </>
        )}
      </Content>
    </Content>
  );
};
