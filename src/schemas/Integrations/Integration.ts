import * as Yup from 'yup';
import Lazy from 'yup/lib/Lazy';

import { Schemas } from '../../generated/OpenapiIntegrations';
import {
    IntegrationCamel,
    IntegrationHttp,
    IntegrationType, NewIntegration,
    NewIntegrationBase, NewIntegrationTemplate
} from '../../types/Integration';

export const maxIntegrationNameLength = 150;

export const IntegrationSchemaBase: Yup.SchemaOf<NewIntegrationBase> = Yup.object({
    id: Yup.string().optional(),
    name: Yup.string().required('Write a name for this Integration.').max(maxIntegrationNameLength).trim(),
    type: Yup.mixed<IntegrationType>().oneOf([ IntegrationType.WEBHOOK, IntegrationType.CAMEL ]).default(IntegrationType.WEBHOOK).optional(),
    isEnabled: Yup.boolean().default(true).required()
});

export const IntegrationHttpSchema: Yup.SchemaOf<NewIntegrationTemplate<IntegrationHttp>> = IntegrationSchemaBase.concat(Yup.object().shape({
    type: Yup.mixed<IntegrationType.WEBHOOK>().oneOf([ IntegrationType.WEBHOOK ]).required(),
    url: Yup.string().url().required('Write a valid url for this Integration.'),
    sslVerificationEnabled: Yup.boolean().default(true),
    secretToken: Yup.string().notRequired(),
    method: Yup.mixed<Schemas.HttpType>().oneOf(Object.values(Schemas.HttpType.Enum)).default(Schemas.HttpType.Enum.POST)
}));

export const IntegrationCamelSchema: Yup.SchemaOf<NewIntegrationTemplate<IntegrationCamel>> = IntegrationSchemaBase.concat(Yup.object().shape({
    type: Yup.mixed<IntegrationType.CAMEL>().oneOf([ IntegrationType.CAMEL ]).required(),
    url: Yup.string().url().required('Provide a url/host for this Integration.'),
    sslVerificationEnabled: Yup.boolean().default(true),
    secretToken: Yup.string().notRequired(),
    subType: Yup.string().required('Provide a camel sub-type'),
    basicAuth: Yup.object().shape({
        user: Yup.string().when('pass',
            {
                is: pass => pass && pass.length > 0,
                then: Yup.string().required('Provide an user')
            }
        ),
        pass: Yup.string().when('user',
            {
                is: user => user && user.length > 0,
                then: Yup.string().required('Provide a password.')
            }
        )
    }, [ [ 'user', 'pass' ] ]).optional(),
    extras: Yup.mixed()
    .default({})
    .transform(s => {
        try {
            return JSON.parse(s);
        } catch (e) {
            return null;
        }
    })
    .test('valid-json-object', 'Provide a valid json object', extras => extras && typeof extras === 'object')
}));

export const IntegrationSchema: Lazy<Yup.SchemaOf<NewIntegration | NewIntegrationBase | NewIntegrationBase>> = Yup.lazy(value => {
    if (value) {
        if (value.type === IntegrationType.WEBHOOK) {
            return IntegrationHttpSchema;
        }

        if (value.type === IntegrationType.CAMEL) {
            return IntegrationCamelSchema;
        }
    }

    return IntegrationSchemaBase;
});
