import React from 'react';
import {
  IntegrationIcon,
  IntegrationIconTypes,
} from '../../../types/Integration';
import { Button, Tooltip } from '@patternfly/react-core';

export const INTEGRATION_TYPE = 'type';
export const EVENT_TYPES_TABLE = 'event-types-table';

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
export const SELECTABLE_TABLE = 'selectable-table';
export const TABLE_TOOLBAR = 'table-toolbar';

export const behaviorGroupTooltip = (
  <Tooltip
    content={
      <div>
        Behavior groups are made up of action/recipient pairings that allow you
        to configure which notification actions different users will be able to
        receiveMessageOnPort. Once you&apos;ve created a behavior group, you can
        assign it to a notification event
      </div>
    }
    position="bottom"
  >
    <Button variant="link">behavior group</Button>
  </Tooltip>
);

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
