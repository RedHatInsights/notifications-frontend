import { Content, ContentVariants } from '@patternfly/react-core';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { UserIntegrationType } from '../../../../types/Integration';
import { getOuiaProps } from '../../../../utils/getOuiaProps';
import { ExpandedContentProps, expandedContentTitleClass } from '../ExpandedContent';

const messages = defineMessages({
  integrationKey: {
    id: 'integrations.pagerDutyExpanded.integrationKey',
    defaultMessage: 'Integration Key',
  },
  secretToken: {
    id: 'integrations.pagerDutyExpanded.secretToken',
    defaultMessage: 'Secret token',
  },
  severity: {
    id: 'integrations.pagerDutyExpanded.severity',
    defaultMessage: 'Severity',
  },
  none: {
    id: 'integrations.pagerDutyExpanded.none',
    defaultMessage: 'None',
  },
});
export const PagerDutyExpandedContent: React.FunctionComponent<
  ExpandedContentProps<UserIntegrationType>
> = (props) => {
  const intl = useIntl();
  return (
    <Content {...getOuiaProps('Integrations/Table/PagerDutyExpandedContent', props)}>
      <Content component={ContentVariants.dl}>
        {'secretToken' in props.integration && (
          <>
            <Content className={expandedContentTitleClass} component={ContentVariants.dt}>
              {intl.formatMessage(messages.integrationKey)}
            </Content>
            <Content component={ContentVariants.dd}>
              {props.integration.secretToken !== undefined
                ? intl.formatMessage(messages.secretToken)
                : intl.formatMessage(messages.none)}
            </Content>
          </>
        )}
        {props.integration['severity'] && (
          <>
            <Content className={expandedContentTitleClass} component={ContentVariants.dt}>
              {intl.formatMessage(messages.severity)}
            </Content>
            <Content component={ContentVariants.dd}>{props.integration['severity']}</Content>
          </>
        )}
      </Content>
    </Content>
  );
};
