import { Content, ContentVariants } from '@patternfly/react-core';
import * as React from 'react';

import { CamelIntegrationType } from '../../../../types/Integration';
import { getOuiaProps } from '../../../../utils/getOuiaProps';
import {
  ExpandedContentProps,
  expandedContentTitleClass,
} from '../ExpandedContent';

export const TeamsExpandedContent: React.FunctionComponent<
  ExpandedContentProps<CamelIntegrationType>
> = (props) => {
  return (
    <Content
      {...getOuiaProps('Integrations/Table/TeamsExpandedContent', props)}
    >
      <Content component={ContentVariants.dl}>
        <Content
          className={expandedContentTitleClass}
          component={ContentVariants.dt}
        >
          Endpoint URL
        </Content>
        <Content component={ContentVariants.dd}>
          {props.integration.url}
        </Content>
      </Content>
    </Content>
  );
};
