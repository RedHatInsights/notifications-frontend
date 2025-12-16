import { Content, ContentVariants } from '@patternfly/react-core';
import * as React from 'react';

import { UserIntegrationType } from '../../../../types/Integration';
import { getOuiaProps } from '../../../../utils/getOuiaProps';
import {
  ExpandedContentProps,
  expandedContentTitleClass,
} from '../ExpandedContent';

export const IntegrationExpandedContent: React.FunctionComponent<
  ExpandedContentProps<UserIntegrationType>
> = (props) => {
  return (
    <Content
      {...getOuiaProps('Integrations/Table/IntegrationExpandedContent', props)}
    >
      <Content component={ContentVariants.dl}>
        {props.integration['url'] && (
          <>
            <Content
              className={expandedContentTitleClass}
              component={ContentVariants.dt}
            >
              Endpoint URL
            </Content>
            <Content component={ContentVariants.dd}>
              {props.integration['url']}
            </Content>
          </>
        )}
        {props.integration['sslVerificationEnabled'] && (
          <>
            <Content
              className={expandedContentTitleClass}
              component={ContentVariants.dt}
            >
              SSL verification
            </Content>
            <Content component={ContentVariants.dd}>
              {props.integration['sslVerificationEnabled']
                ? 'Enabled'
                : 'Disabled'}
            </Content>
          </>
        )}
        {'secretToken' in props.integration && (
          <>
            <Content
              className={expandedContentTitleClass}
              component={ContentVariants.dt}
            >
              Authentication type
            </Content>
            <Content component={ContentVariants.dd}>
              {props.integration.secretToken !== undefined
                ? 'Secret token'
                : 'None'}
            </Content>
          </>
        )}
      </Content>
    </Content>
  );
};
