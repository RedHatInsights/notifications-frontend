import * as Yup from 'yup';
import {
    IntegrationHttp,
    IntegrationType, NewIntegration,
    NewIntegrationBase, NewIntegrationTemplate
} from '../../types/Integration';
import { HttpType } from '../../generated/OpenapiIntegrations';

export const maxIntegrationNameLength = 150;

export const IntegrationSchemaBase = Yup.object<NewIntegrationBase>({
    name: Yup.string().required('Write a name for this Integration.').max(maxIntegrationNameLength).trim(),
    type: Yup.mixed<IntegrationType>().oneOf([ IntegrationType.WEBHOOK ]).default(IntegrationType.WEBHOOK),
    isEnabled: Yup.boolean().default(true).required()
});

export const IntegrationHttpSchema = IntegrationSchemaBase.concat(Yup.object<NewIntegrationTemplate<IntegrationHttp>>().shape({
    type: Yup.mixed<IntegrationType.WEBHOOK>().oneOf([ IntegrationType.WEBHOOK ]).required(),
    url: Yup.string().url().required('Write a valid url for this Integration.'),
    sslVerificationEnabled: Yup.boolean().default(true),
    secretToken: Yup.string().notRequired(),
    method: Yup.mixed<HttpType>().oneOf(Object.values(HttpType.Enum)).default(HttpType.Enum.POST)
}));

export const IntegrationSchema = Yup.lazy<NewIntegration | NewIntegrationBase | undefined>(value => {
    if (value) {
        if (value.type === IntegrationType.WEBHOOK) {
            return IntegrationHttpSchema;
        }
    }

    return IntegrationSchemaBase;
});
