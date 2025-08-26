import * as Yup from 'yup';
import Lazy from 'yup/lib/Lazy';

import { Schemas } from '../../generated/OpenapiIntegrations';
import {
  CamelIntegrationType,
  IntegrationAnsible,
  IntegrationCamel,
  IntegrationHttp,
  IntegrationType,
  NewIntegration,
  NewIntegrationBase,
  NewIntegrationTemplate,
  isCamelType,
} from '../../types/Integration';

export const maxIntegrationNameLength = 150;

export const IntegrationSchemaBase: Yup.SchemaOf<NewIntegrationBase> =
  Yup.object({
    id: Yup.string().optional(),
    name: Yup.string()
      .required('Write a name for this Integration.')
      .max(maxIntegrationNameLength)
      .trim(),
    type: Yup.mixed<IntegrationType>()
      .oneOf(Object.values(IntegrationType))
      .default(IntegrationType.WEBHOOK)
      .optional(),
    isEnabled: Yup.boolean().default(true).required(),
    status: Yup.mixed<Schemas.EndpointStatus>()
      .oneOf(Object.values(Schemas.EndpointStatus.Enum))
      .default(Schemas.EndpointStatus.Enum.UNKNOWN),
    serverErrors: Yup.number().default(0),
    eventTypes: Yup.array().of(Yup.string()).optional(),
  });

export const IntegrationHttpSchema: Yup.SchemaOf<
  NewIntegrationTemplate<IntegrationHttp>
> = IntegrationSchemaBase.concat(
  Yup.object().shape({
    type: Yup.mixed<IntegrationType.WEBHOOK>()
      .oneOf([IntegrationType.WEBHOOK])
      .required(),
    url: Yup.string().url().required('Write a valid url for this Integration.'),
    sslVerificationEnabled: Yup.boolean().default(true),
    secretToken: Yup.string().notRequired(),
    method: Yup.mixed<Schemas.HttpType>()
      .oneOf(Object.values(Schemas.HttpType.Enum))
      .default(Schemas.HttpType.Enum.POST),
  })
);

export const IntegrationAnsibleSchema: Yup.SchemaOf<
  NewIntegrationTemplate<IntegrationAnsible>
> = IntegrationSchemaBase.concat(
  Yup.object().shape({
    type: Yup.mixed<IntegrationType.ANSIBLE>()
      .oneOf([IntegrationType.ANSIBLE])
      .required(),
    url: Yup.string().url().required('Write a valid url for this Integration.'),
    sslVerificationEnabled: Yup.boolean().default(true),
    secretToken: Yup.string().notRequired(),
    method: Yup.mixed<Schemas.HttpType>()
      .oneOf(Object.values([Schemas.HttpType.Enum.POST]))
      .default(Schemas.HttpType.Enum.POST),
  })
);

export const IntegrationCamelSchema: Yup.SchemaOf<
  NewIntegrationTemplate<IntegrationCamel>
> = IntegrationSchemaBase.concat(
  Yup.object().shape({
    type: Yup.mixed<CamelIntegrationType>()
      .oneOf(
        Object.values(IntegrationType).filter((v) =>
          isCamelType(v)
        ) as Array<CamelIntegrationType>
      )
      .required(),
    url: Yup.string()
      .url()
      .required('Provide a url/host for this Integration.'),
    sslVerificationEnabled: Yup.boolean().default(true),
    secretToken: Yup.string().optional(),
    basicAuth: Yup.object()
      .shape(
        {
          user: Yup.string().when('pass', {
            is: (pass) => pass && pass.length > 0,
            then: Yup.string().required('Provide an user'),
          }),
          pass: Yup.string().when('user', {
            is: (user) => user && user.length > 0,
            then: Yup.string().required('Provide a password.'),
          }),
        },
        [['user', 'pass']]
      )
      .optional(),
    extras: Yup.mixed()
      .default({})
      .transform((s) => {
        if (typeof s === 'string') {
          if (!s.trim()) return {};
          try {
            return JSON.parse(s);
          } catch (e) {
            throw new Yup.ValidationError(
              `Invalid JSON in extras: ${
                e instanceof Error ? e.message : String(e)
              }. Input: "${s}"`,
              s,
              'extras'
            );
          }
        }
        return s;
      })
      .test(
        'valid-object',
        'Extras must be a valid object',
        (value) => value !== null && typeof value === 'object'
      ),
  })
);

export const IntegrationSchema: Lazy<
  Yup.SchemaOf<NewIntegration | NewIntegrationBase | NewIntegrationBase>
> = Yup.lazy((value) => {
  if (value) {
    if (value.type === IntegrationType.WEBHOOK) {
      return IntegrationHttpSchema;
    } else if (value.type === IntegrationType.ANSIBLE) {
      return IntegrationAnsibleSchema;
    }

    if (isCamelType(value.type)) {
      return IntegrationCamelSchema;
    }
  }

  return IntegrationSchemaBase;
});
