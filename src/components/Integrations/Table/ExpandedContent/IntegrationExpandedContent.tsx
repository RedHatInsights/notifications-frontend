import { Content, ContentVariants } from '@patternfly/react-core';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { UserIntegrationType } from '../../../../types/Integration';
import { getOuiaProps } from '../../../../utils/getOuiaProps';
import { ExpandedContentProps, expandedContentTitleClass } from '../ExpandedContent';

const messages = defineMessages({
  endpointUrl: {
    id: 'integrations.expandedContent.endpointUrl',
    defaultMessage: 'Endpoint URL',
  },
  sslVerification: {
    id: 'integrations.expandedContent.sslVerification',
    defaultMessage: 'SSL verification',
  },
  enabled: {
    id: 'integrations.expandedContent.enabled',
    defaultMessage: 'Enabled',
  },
  disabled: {
    id: 'integrations.expandedContent.disabled',
    defaultMessage: 'Disabled',
  },
  authenticationType: {
    id: 'integrations.expandedContent.authenticationType',
    defaultMessage: 'Authentication type',
  },
  secretToken: {
    id: 'integrations.expandedContent.secretToken',
    defaultMessage: 'Secret token',
  },
  none: {
    id: 'integrations.expandedContent.none',
    defaultMessage: 'None',
  },
});

export const IntegrationExpandedContent: React.FunctionComponent<
  ExpandedContentProps<UserIntegrationType>
> = (props) => {
  const intl = useIntl();
  return (
    <Content {...getOuiaProps('Integrations/Table/IntegrationExpandedContent', props)}>
      <Content component={ContentVariants.dl}>
        {props.integration['url'] && (
          <>
            <Content className={expandedContentTitleClass} component={ContentVariants.dt}>
              {intl.formatMessage(messages.endpointUrl)}
            </Content>
            <Content component={ContentVariants.dd}>{props.integration['url']}</Content>
          </>
        )}
        {props.integration['sslVerificationEnabled'] && (
          <>
            <Content className={expandedContentTitleClass} component={ContentVariants.dt}>
              {intl.formatMessage(messages.sslVerification)}
            </Content>
            <Content component={ContentVariants.dd}>
              {props.integration['sslVerificationEnabled']
                ? intl.formatMessage(messages.enabled)
                : intl.formatMessage(messages.disabled)}
            </Content>
          </>
        )}
        {'secretToken' in props.integration && (
          <>
            <Content className={expandedContentTitleClass} component={ContentVariants.dt}>
              {intl.formatMessage(messages.authenticationType)}
            </Content>
            <Content component={ContentVariants.dd}>
              {props.integration.secretToken !== undefined
                ? intl.formatMessage(messages.secretToken)
                : intl.formatMessage(messages.none)}
            </Content>
          </>
        )}
      </Content>
    </Content>
  );
};
