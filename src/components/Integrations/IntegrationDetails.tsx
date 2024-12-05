import React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Icon,
} from '@patternfly/react-core';
import { IntegrationIcon, IntegrationType } from '../../types/Integration';
import { IntegrationStatus, StatusUnknown } from './Table/IntegrationStatus';
import { IntegrationRow } from './Table';
import Config, { defaultIconList } from '../../config/Config';
import messages from '../../properties/DefinedMessages';
import { useIntl } from 'react-intl';
import {
  GoogleOrTeamsContent,
  PagerDutyContent,
  SlackContent,
} from './IntegrationDetailsContent';
import { CheckCircleIcon, StopCircleIcon } from '@patternfly/react-icons';

export const getIntegrationIcon = (type: string): React.ReactElement | null => {
  const allIcons = {
    ...defaultIconList['Communications'],
    ...defaultIconList['Reporting'],
  };
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

interface IntegrationDetailsProps {
  integration?: IntegrationRow;
}

const IntegrationDetails: React.FunctionComponent<IntegrationDetailsProps> = ({
  integration,
}) => {
  const intl = useIntl();

  const buildIntegrationDetails = (integration: IntegrationRow) => {
    if (integration.type === IntegrationType.SLACK) {
      return <SlackContent integration={integration} />;
    }

    if (
      integration.type === IntegrationType.TEAMS ||
      integration.type === IntegrationType.GOOGLE_CHAT
    ) {
      return <GoogleOrTeamsContent integration={integration} />;
    }

    if (integration.type === IntegrationType.PAGERDUTY) {
      return <PagerDutyContent integration={integration} />;
    }
  };

  return (
    <DescriptionList isHorizontal className="pf-v5-u-p-sm pf-v5-u-m-sm">
      <DescriptionListGroup>
        <DescriptionListTerm>
          {' '}
          {intl.formatMessage(messages.integrationType)}
        </DescriptionListTerm>
        <DescriptionListDescription>
          {integration && getIntegrationIcon(integration.type)}
          {integration && Config.integrations.types[integration.type].name}
        </DescriptionListDescription>
        <DescriptionListTerm>
          {intl.formatMessage(messages.lastConnectionAttempt)}
        </DescriptionListTerm>
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
        <DescriptionListTerm>
          {intl.formatMessage(messages.enabled)}
        </DescriptionListTerm>
        <DescriptionListDescription>
          <Icon status={integration?.isEnabled ? 'success' : 'warning'}>
            {integration?.isEnabled ? (
              <CheckCircleIcon data-testid="success-icon" />
            ) : (
              <StopCircleIcon data-testid="error-icon" />
            )}
          </Icon>
        </DescriptionListDescription>
        {integration && buildIntegrationDetails(integration)}
      </DescriptionListGroup>
    </DescriptionList>
  );
};

export default IntegrationDetails;
