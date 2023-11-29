import React from 'react';
import {
  IntegrationIcon,
  IntegrationIconTypes,
} from '../../../types/Integration';

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
