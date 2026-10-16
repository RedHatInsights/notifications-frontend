import { Content, ContentVariants } from '@patternfly/react-core';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { CamelIntegrationType } from '../../../../types/Integration';
import { getOuiaProps } from '../../../../utils/getOuiaProps';
import { ExpandedContentProps, expandedContentTitleClass } from '../ExpandedContent';

const messages = defineMessages({
  endpointUrl: {
    id: 'integrations.googleChatExpanded.endpointUrl',
    defaultMessage: 'Endpoint URL',
  },
});
export const GoogleChatExpandedContent: React.FunctionComponent<
  ExpandedContentProps<CamelIntegrationType>
> = (props) => {
  const intl = useIntl();
  return (
    <Content {...getOuiaProps('Integrations/Table/GoogleChatExpandedContent', props)}>
      <Content component={ContentVariants.dl}>
        <Content className={expandedContentTitleClass} component={ContentVariants.dt}>
          {intl.formatMessage(messages.endpointUrl)}
        </Content>
        <Content component={ContentVariants.dd}>{props.integration.url}</Content>
      </Content>
    </Content>
  );
};
