export interface OuiaComponentProps {
  ouiaId?: string;
  ouiaSafe?: boolean;
}

interface UseOuiaReturn {
  'data-ouia-component-type': string;
  'data-ouia-component-id'?: string;
  'data-ouia-safe': boolean;
}

export const getOuiaPropsFactory = (module: string) => (type: string, oiuaProps: OuiaComponentProps): UseOuiaReturn => {
    const props = {
        'data-ouia-component-type': `${module}/${type}`,
        'data-ouia-safe': oiuaProps.ouiaSafe ?? true
    };

    if (oiuaProps.ouiaId) {
        props['data-ouia-component-id'] = oiuaProps.ouiaId;
    }

    return props;
};

export const getOuiaProps = getOuiaPropsFactory('Notifications');
