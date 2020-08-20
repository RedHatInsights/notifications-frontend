import * as Yup from 'yup';
import {
    IntegrationHttp,
    IntegrationType, NewIntegration,
    NewIntegrationBase, NewIntegrationTemplate
} from '../../types/Integration';

export const maxIntegrationNameLength = 150;

export const IntegrationSchemaBase = Yup.object<NewIntegrationBase>().shape({
    name: Yup.string().required('Write a name for this Integration.').max(maxIntegrationNameLength).trim(),
    type: Yup.mixed().oneOf(Object.values(IntegrationType))
});

export const IntegrationHttpSchema = Yup.object<NewIntegrationTemplate<IntegrationHttp>>().shape({
    type: Yup.mixed<IntegrationType.WEBHOOK>().oneOf([ IntegrationType.WEBHOOK ]).required(),
    url: Yup.string().url().required('Write a valid url for this Integration.')
}).concat(IntegrationSchemaBase);

export const IntegrationSchema = Yup.lazy<NewIntegration | NewIntegrationBase>(value => {
    if (value.type === IntegrationType.WEBHOOK) {
        return IntegrationHttpSchema;
    } else {
        return IntegrationSchemaBase;
    }
});
