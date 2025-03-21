import {
  DescriptionListDescription,
  DescriptionListTerm,
} from '@patternfly/react-core';
import {
  IntegrationCamel,
  IntegrationPagerduty,
} from '../../types/Integration';
import { IntegrationRow } from './Table';
import messages from '../../properties/DefinedMessages';
import { useIntl } from 'react-intl';
import React from 'react';

export interface DetailsContentProps {
  integration: IntegrationRow;
}

export const SlackContent: React.FunctionComponent<DetailsContentProps> = ({
  integration,
}) => {
  const intl = useIntl();
  const integrationCamel = integration as IntegrationCamel;
  return (
    <>
      <DescriptionListTerm>
        {intl.formatMessage(messages.endPointUrl)}
      </DescriptionListTerm>
      <DescriptionListDescription>
        {integrationCamel.url}
      </DescriptionListDescription>
      <DescriptionListTerm>
        {' '}
        {intl.formatMessage(messages.sslVerification)}
      </DescriptionListTerm>
      <DescriptionListDescription>
        {integrationCamel.sslVerificationEnabled}
      </DescriptionListDescription>
    </>
  );
};

export const GoogleOrTeamsContent: React.FunctionComponent<
  DetailsContentProps
> = ({ integration }) => {
  const intl = useIntl();
  const integrationCamel = integration as IntegrationCamel;
  return (
    <>
      <DescriptionListTerm>
        {intl.formatMessage(messages.endPointUrl)}
      </DescriptionListTerm>
      <DescriptionListDescription>
        {integrationCamel.url}
      </DescriptionListDescription>
    </>
  );
};

export const PagerDutyContent: React.FunctionComponent<DetailsContentProps> = ({
  integration,
}) => {
  const intl = useIntl();
  const integrationPager = integration as IntegrationPagerduty;
  return (
    <>
      {'secretToken' in integrationPager && (
        <>
          <DescriptionListTerm>
            {intl.formatMessage(messages.integrationKey)}
          </DescriptionListTerm>
          <DescriptionListDescription>
            {integrationPager.secretToken !== undefined
              ? 'Secret token'
              : 'None'}
          </DescriptionListDescription>
        </>
      )}
      {integrationPager.severity && (
        <>
          <DescriptionListTerm>
            {intl.formatMessage(messages.severity)}
          </DescriptionListTerm>
          <DescriptionListDescription>
            {integrationPager.severity}
          </DescriptionListDescription>
        </>
      )}
    </>
  );
};
