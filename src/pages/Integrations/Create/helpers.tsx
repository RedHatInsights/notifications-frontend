import React from 'react';
import {
  IntegrationIcon,
  IntegrationIconTypes,
} from '../../../types/Integration';

export const INTEGRATION_TYPE = 'type';

export const SLACK_DETAILS = 'slack-details';
export const GOOGLE_CHAT_DETAILS = 'gchat-details';
export const TEAMS_DETAILS = 'teams-details';
export const SPLUNK_DETAILS = 'spunk-details';
export const SERVICE_NOW_DETAILS = 'service-now-details';
export const DETAILS = 'details';

export const EVENT_TYPES = 'event-types';

export const REVIEW = 'review';
export const CARD_SELECT = 'card-select';
export const INLINE_ALERT = 'inline-alert';

export const iconMapper =
  (integrationTypes: IntegrationIconTypes | undefined) =>
  (name: string): React.FunctionComponent | null => {
    if (!integrationTypes) {
      return null;
    }

    const integrationType: IntegrationIcon | undefined = Object.values(
      integrationTypes
    ).find((type: IntegrationIcon) => type.name === name);

    if (!integrationType) {
      return null;
    }

    const Icon = () => (
      <img
        src={integrationType.icon_url}
        alt={integrationType.product_name}
        className="src-c-wizard__icon pf-v5-u-mb-sm"
      />
    );

    return Icon;
  };

export const compileAllIntegrationComboOptions = (
  integrationTypes: IntegrationIconTypes | undefined
): Array<{ value: string; label: string }> | null => {
  if (!integrationTypes) {
    return null;
  }
  return Object.values(integrationTypes)
    .map((type: IntegrationIcon) => ({
      ...type,
      product_name: type.product_name,
    }))
    .sort((a, b) => a.product_name.localeCompare(b.product_name))
    .map((t) => ({
      value: t.name,
      label: t.product_name,
    }));
};
