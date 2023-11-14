import React from 'react';

// eslint-disable-next-line react/display-name
export const iconMapper = (integrationTypes) => (name) => {
  const integrationType = integrationTypes.find((type) => type.name === name);

  const Icon = () => (
    <img
      src={integrationType.icon_url}
      alt={integrationType.product_name}
      className="src-c-wizard__icon pf-u-mb-sm"
    />
  );

  return Icon;
};

export const compileAllIntegrationComboOptions = (integrationTypes) => [
  ...integrationTypes
    .map((type) => ({
      ...type,
      product_name: type.product_name,
    }))
    .sort((a, b) => a.product_name.localeCompare(b.product_name))
    .map((t) => ({
      value: t.name,
      label: t.product_name,
    })),
];
