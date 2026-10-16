import { DescriptionListDescription, DescriptionListTerm } from '@patternfly/react-core';
import { IntegrationCamel, IntegrationPagerduty } from '../../types/Integration';
import { IntegrationRow } from './Table';
import { defineMessages, useIntl } from 'react-intl';
import React from 'react';

export interface DetailsContentProps {
  integration: IntegrationRow;
}

const messages = defineMessages({
  endPointUrl: {
    id: 'integrations.detailsContent.endPointUrl',
    defaultMessage: 'Endpoint URL',
  },
  sslVerification: {
    id: 'integrations.detailsContent.sslVerification',
    defaultMessage: 'SSL Verification',
  },
  severity: {
    id: 'integrations.detailsContent.severity',
    defaultMessage: 'Severity',
  },
  enabled: {
    id: 'integrations.detailsContent.enabled',
    defaultMessage: 'Enabled',
  },
  integrationKey: {
    id: 'integrations.detailsContent.integrationKey',
    defaultMessage: 'Integration Key',
  },
  secretToken: {
    id: 'integrations.detailsContent.secretToken',
    defaultMessage: 'Secret token',
  },
  none: {
    id: 'integrations.detailsContent.none',
    defaultMessage: 'None',
  },
});
export const SlackContent: React.FunctionComponent<DetailsContentProps> = ({ integration }) => {
  const intl = useIntl();
  const integrationCamel = integration as IntegrationCamel;
  return (
    <>
      <DescriptionListTerm>{intl.formatMessage(messages.endPointUrl)}</DescriptionListTerm>
      <DescriptionListDescription>{integrationCamel.url}</DescriptionListDescription>
      <DescriptionListTerm> {intl.formatMessage(messages.sslVerification)}</DescriptionListTerm>
      <DescriptionListDescription>
        {integrationCamel.sslVerificationEnabled}
      </DescriptionListDescription>
    </>
  );
};

export const GoogleOrTeamsContent: React.FunctionComponent<DetailsContentProps> = ({
  integration,
}) => {
  const intl = useIntl();
  const integrationCamel = integration as IntegrationCamel;
  return (
    <>
      <DescriptionListTerm>{intl.formatMessage(messages.endPointUrl)}</DescriptionListTerm>
      <DescriptionListDescription>{integrationCamel.url}</DescriptionListDescription>
    </>
  );
};

export const PagerDutyContent: React.FunctionComponent<DetailsContentProps> = ({ integration }) => {
  const intl = useIntl();
  const integrationPager = integration as IntegrationPagerduty;
  return (
    <>
      {'secretToken' in integrationPager && (
        <>
          <DescriptionListTerm>{intl.formatMessage(messages.integrationKey)}</DescriptionListTerm>
          <DescriptionListDescription>
            {integrationPager.secretToken !== undefined
              ? intl.formatMessage(messages.secretToken)
              : intl.formatMessage(messages.none)}
          </DescriptionListDescription>
        </>
      )}
      {integrationPager.severity && (
        <>
          <DescriptionListTerm>{intl.formatMessage(messages.severity)}</DescriptionListTerm>
          <DescriptionListDescription>{integrationPager.severity}</DescriptionListDescription>
        </>
      )}
    </>
  );
};
