import React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import {
  IntegrationCamel,
  IntegrationIcon,
  IntegrationPagerduty,
  IntegrationType,
} from '../../types/Integration';
import { IntegrationStatus, StatusUnknown } from './Table/IntegrationStatus';
import { IntegrationRow } from './Table';
import Config, { defaultIconList } from '../../config/Config';

export const getIntegrationIcon = (type: string): React.ReactElement | null => {
  const allIcons = Object.assign(
    defaultIconList['Communications'],
    defaultIconList['Reporting']
  );
  const integrationType: IntegrationIcon | undefined = Object.values(
    allIcons
  ).find((icon: IntegrationIcon) => icon.name === type);
  if (integrationType === undefined) {
    return null;
  }
  return (
    <>
      <img
        width="16px"
        src={integrationType.icon_url}
        alt={integrationType.product_name}
        className="pf-v5-u-mr-sm"
      />
    </>
  );
};

const buildIntegrationDetails = (integration: IntegrationRow) => {
  if (integration.type === IntegrationType.SLACK) {
    const integrationCamel = integration as IntegrationCamel;
    return (
      <>
        <DescriptionListTerm>Endpoint URL</DescriptionListTerm>
        <DescriptionListDescription>
          {integrationCamel.url}
        </DescriptionListDescription>
        <DescriptionListTerm>SSL Verification</DescriptionListTerm>
        <DescriptionListDescription>
          {integrationCamel.sslVerificationEnabled}
        </DescriptionListDescription>
      </>
    );
  }

  if (
    integration.type === IntegrationType.TEAMS ||
    integration.type === IntegrationType.GOOGLE_CHAT
  ) {
    const integrationCamel = integration as IntegrationCamel;
    return (
      <>
        <DescriptionListTerm>Endpoint URL</DescriptionListTerm>
        <DescriptionListDescription>
          {integrationCamel.url}
        </DescriptionListDescription>
      </>
    );
  }

  if (integration.type === IntegrationType.PAGERDUTY) {
    const integrationPager = integration as IntegrationPagerduty;
    return (
      <>
        {'secretToken' in integrationPager && (
          <>
            <DescriptionListTerm>Integration Key</DescriptionListTerm>
            <DescriptionListDescription>
              {integrationPager.secretToken !== undefined
                ? 'Secret token'
                : 'None'}
            </DescriptionListDescription>
          </>
        )}
        {integrationPager.severity && (
          <>
            <DescriptionListTerm>Severity</DescriptionListTerm>
            <DescriptionListDescription>
              {integrationPager.severity}
            </DescriptionListDescription>
          </>
        )}
      </>
    );
  }
};

interface IntegrationDetailsProps {
  integration?: IntegrationRow;
}

const IntegrationDetails: React.FunctionComponent<IntegrationDetailsProps> = ({
  integration,
}) => {
  return (
    <DescriptionList isHorizontal className="pf-v5-u-p-sm pf-v5-u-m-sm">
      <DescriptionListGroup>
        <DescriptionListTerm>Integration type</DescriptionListTerm>
        <DescriptionListDescription>
          {integration && getIntegrationIcon(integration.type)}
          {integration && Config.integrations.types[integration.type].name}
        </DescriptionListDescription>
        <DescriptionListTerm>Last connection attempt</DescriptionListTerm>
        <DescriptionListDescription>
          {integration?.lastConnectionAttempts === undefined ? (
            <StatusUnknown />
          ) : (
            <IntegrationStatus
              status={integration.status}
              lastConnectionAttempts={
                integration.isConnectionAttemptLoading
                  ? undefined
                  : integration.lastConnectionAttempts
              }
              includeDetails={integration.includeDetails}
            />
          )}
        </DescriptionListDescription>
        <DescriptionListTerm>Enabled</DescriptionListTerm>
        <DescriptionListDescription>
          {integration?.isEnabled}
        </DescriptionListDescription>
        {integration && buildIntegrationDetails(integration)}
      </DescriptionListGroup>
    </DescriptionList>
  );
};

export default IntegrationDetails;
