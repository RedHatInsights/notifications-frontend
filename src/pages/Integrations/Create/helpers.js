// eslint-disable-next-line react/display-name
export const iconMapper = (sourceTypes) => (name) => {
  const sourceType = sourceTypes.find((type) => type.name === name);

  if (!sourceType || (!sourceType.icon_url && !shortIcons[name])) {
    return null;
  }

  const Icon = () => (
    <img
      src={shortIcons[name] || sourceType.icon_url}
      alt={sourceType.product_name}
      className={`src-c-wizard__icon ${sourceType.category === 'Red Hat' ? 'redhat-icon' : 'pf-u-mb-sm'}`}
    />
  );

  return Icon;
};

export const compileAllSourcesComboOptions = (sourceTypes) => [
  ...sourceTypes
    .map((type) => ({
      ...type,
      product_name: type.category === 'Red Hat' ? type.product_name.replace('Red Hat ', '') : type.product_name,
    }))
    .sort((a, b) => a.product_name.localeCompare(b.product_name))
    .map((t) => ({
      value: t.name,
      label: t.product_name,
    })),
];