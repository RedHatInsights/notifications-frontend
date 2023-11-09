// eslint-disable-next-line react/display-name
export const iconMapper = (integrationTypes) => (name) => {
  const integrationType = integrationTypes.find((type) => type.name === name);

  if (!integrationType || (!integrationType.icon_url && !shortIcons[name])) {
    return null;
  }

  const Icon = () => (
      <img
          src={shortIcons[name] || integrationType.icon_url}
          alt={integrationType.product_name}
          className={ `src-c-wizard__icon ${integrationType.category === 'Red Hat' ? 'redhat-icon' : 'pf-u-mb-sm'}` }
        />
  );

    return Icon;
};

export const compileAllSourcesComboOptions = (integrationTypes) => [
    ...integrationTypes
    .map((type) => ({
        ...type,
        product_name: type.category === 'Red Hat' ? type.product_name.replace('Red Hat ', '') : type.product_name
    }))
    .sort((a, b) => a.product_name.localeCompare(b.product_name))
    .map((t) => ({
        value: t.name,
        label: t.product_name
    }))
];
