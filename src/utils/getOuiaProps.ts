import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';

export const getOuiaPropsFactory =
  (module: string) => (type: string, oiuaProps: OuiaProps) => {
    const props = {
      'data-ouia-component-type': `${module}/${type}`,
      'data-ouia-safe': oiuaProps.ouiaSafe ?? true,
    };

    if (oiuaProps.ouiaId) {
      props['data-ouia-component-id'] = oiuaProps.ouiaId;
    }

    return props;
  };

export const ouiaIdConcat = (
  ouiaIdParent: string | undefined,
  ouiaId: string
) => {
  if (ouiaIdParent) {
    return `${ouiaIdParent}.${ouiaId}`;
  }

  return ouiaId;
};

export const getOuiaProps = getOuiaPropsFactory('Notifications');
