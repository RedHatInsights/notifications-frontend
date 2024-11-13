import React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import {
  CamelIntegrationType,
  IntegrationCamel,
  IntegrationIconTypes,
  IntegrationPagerduty,
  IntegrationType,
} from '../../types/Integration';
import { IntegrationStatus, StatusUnknown } from './Table/IntegrationStatus';
import { IntegrationRow } from './Table';
import { iconMapper } from '../../pages/Integrations/Create/helpers';
import Config, { defaultIconList } from '../../config/Config';

interface IntegrationDetailsProps {
  integration?: IntegrationRow;
}

const ouiaId = 'IntegrationsTable';

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

const integrationIcon = (type: CamelIntegrationType) => {
  return iconMapper(defaultIconList[type]) === null
    ? iconMapper(defaultIconList[type])
    : '';
};

const IntegrationsDrawer: React.FunctionComponent<IntegrationDetailsProps> = ({
  integration,
}) => {
  return (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>Integration type</DescriptionListTerm>
        <DescriptionListDescription>
          {integration && Config.integrations.types[integration.type].name}
          {/* {integrationIcon(integration?.type)} */}
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

export default IntegrationsDrawer;
