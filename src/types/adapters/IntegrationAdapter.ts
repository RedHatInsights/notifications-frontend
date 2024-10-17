import { assertNever } from 'assert-never';

import { Schemas } from '../../generated/OpenapiIntegrations';
import {
  CamelIntegrationType,
  Integration,
  IntegrationAnsible,
  IntegrationBase,
  IntegrationCamel,
  IntegrationDrawer,
  IntegrationEmailSubscription,
  IntegrationHttp,
  IntegrationPagerduty,
  IntegrationType,
  NewIntegration,
  ServerIntegrationRequest,
  ServerIntegrationResponse,
  isCamelType,
} from '../Integration';

interface ExternalCompositeTyped {
  type: string;
  sub_type?: string | null;
}

export const getIntegrationType = (
  serverIntegration: ExternalCompositeTyped
): IntegrationType => {
  for (const integration of Object.values(IntegrationType)) {
    if (serverIntegration.sub_type) {
      if (
        integration ===
        `${serverIntegration.type}:${serverIntegration.sub_type}`
      ) {
        return integration as IntegrationType;
      }
    } else if (integration === serverIntegration.type) {
      return integration as IntegrationType;
    }
  }

  throw new Error(
    `Unexpected type: ${serverIntegration.type} with subtype: ${serverIntegration.sub_type}`
  );
};

const getEndpointType = (
  type: IntegrationType
): { type: Schemas.EndpointTypeDTO; subType?: string } => {
  const splitType = type.split(':', 2);
  return {
    type: splitType[0] as Schemas.EndpointTypeDTO,
    subType: splitType.length === 2 ? splitType[1] : undefined,
  };
};

type NotNullType = {
  <T>(value: T | undefined | null): T | undefined;
  <T>(value: T | undefined | null, defaultValue: T): T;
};

const notNull: NotNullType = <T>(
  value: T | undefined | null,
  defaultValue?: T
): T | undefined => (value === null ? defaultValue : value);
const toSecretToken = (
  secretToken: string | undefined | null
): string | undefined =>
  secretToken === '' ? undefined : notNull(secretToken);

const toIntegrationWebhook = (
  integrationBase: IntegrationBase<IntegrationType.WEBHOOK>,
  properties?: Schemas.WebhookPropertiesDTO
): IntegrationHttp => ({
  ...integrationBase,
  url: properties?.url ?? '',
  sslVerificationEnabled: !properties?.disableSslVerification ?? false,
  secretToken: toSecretToken(properties?.secretToken),
  method: properties?.method ?? Schemas.HttpType.Enum.GET,
});

const toIntegrationAnsible = (
  integrationBase: IntegrationBase<IntegrationType.ANSIBLE>,
  properties?: Schemas.WebhookPropertiesDTO
): IntegrationAnsible => ({
  ...integrationBase,
  url: properties?.url ?? '',
  sslVerificationEnabled: !properties?.disableSslVerification ?? false,
  secretToken: toSecretToken(properties?.secretToken),
  method: properties?.method ?? Schemas.HttpType.Enum.POST,
});

const toIntegrationCamel = (
  integrationBase: IntegrationBase<CamelIntegrationType>,
  properties?: Schemas.CamelPropertiesDTO
): IntegrationCamel => ({
  ...integrationBase,
  url: properties?.url ?? '',
  sslVerificationEnabled: !properties?.disableSslVerification ?? false,
  secretToken: toSecretToken(properties?.secretToken),
  basicAuth:
    properties?.basicAuthentication === null
      ? undefined
      : {
          user: notNull(properties?.basicAuthentication?.username, ''),
          pass: notNull(properties?.basicAuthentication?.password, ''),
        },
  extras: notNull(properties?.extras),
});

const toIntegrationEmail = (
  integrationBase: IntegrationBase<IntegrationType.EMAIL_SUBSCRIPTION>,
  properties: Schemas.SystemSubscriptionPropertiesDTO
): IntegrationEmailSubscription => ({
  ...integrationBase,
  ignorePreferences: properties.ignorePreferences,
  groupId: properties.groupId === null ? undefined : properties.groupId,
  onlyAdmin: properties.onlyAdmins === null ? undefined : properties.onlyAdmins,
});

const toIntegrationDrawer = (
  integrationBase: IntegrationBase<IntegrationType.DRAWER>,
  properties: Schemas.SystemSubscriptionPropertiesDTO
): IntegrationDrawer => ({
  ...integrationBase,
  ignorePreferences: properties.ignorePreferences,
  groupId: properties.groupId === null ? undefined : properties.groupId,
  onlyAdmin: properties.onlyAdmins,
});

const toIntegrationPagerDuty = (
  integrationBase: IntegrationBase<IntegrationType.PAGERDUTY>,
  properties: Schemas.PagerDutyPropertiesDTO
): IntegrationPagerduty => ({
  ...integrationBase,
  secretToken: properties.secretToken,
  severity: properties.severity,
});

export const toIntegration = (
  serverIntegration: ServerIntegrationResponse
): Integration => {
  const integrationBase: IntegrationBase<IntegrationType> = {
    id: serverIntegration.id || '',
    name: serverIntegration.name || '',
    isEnabled: !!serverIntegration.enabled,
    type: getIntegrationType({
      ...serverIntegration,
      type: serverIntegration.type ?? '',
    }),
    status: serverIntegration.status ?? 'UNKNOWN',
    serverErrors: serverIntegration.server_errors ?? 0,
  };

  if (isCamelType(integrationBase.type)) {
    return toIntegrationCamel(
      integrationBase as IntegrationBase<CamelIntegrationType>,
      serverIntegration.properties as Schemas.CamelPropertiesDTO
    );
  }

  switch (integrationBase.type) {
    case IntegrationType.WEBHOOK:
      return toIntegrationWebhook(
        integrationBase as IntegrationBase<IntegrationType.WEBHOOK>,
        serverIntegration.properties as Schemas.WebhookPropertiesDTO
      );
    case IntegrationType.ANSIBLE:
      return toIntegrationAnsible(
        integrationBase as IntegrationBase<IntegrationType.ANSIBLE>,
        serverIntegration.properties as Schemas.WebhookPropertiesDTO
      );
    case IntegrationType.EMAIL_SUBSCRIPTION:
      return toIntegrationEmail(
        integrationBase as IntegrationBase<IntegrationType.EMAIL_SUBSCRIPTION>,
        serverIntegration.properties as Schemas.SystemSubscriptionPropertiesDTO
      );
    case IntegrationType.DRAWER:
      return toIntegrationDrawer(
        integrationBase as IntegrationBase<IntegrationType.DRAWER>,
        serverIntegration.properties as Schemas.SystemSubscriptionPropertiesDTO
      );
    case IntegrationType.PAGERDUTY:
      return toIntegrationPagerDuty(
        integrationBase as IntegrationBase<IntegrationType.PAGERDUTY>,
        serverIntegration.properties as Schemas.PagerDutyPropertiesDTO
      );
    default:
      assertNever(integrationBase.type);
  }
};

export const toIntegrations = (
  serverIntegrations: Array<ServerIntegrationResponse>
): Array<Integration> => {
  return serverIntegrations.map(toIntegration);
};

type ServerIntegrationProperties =
  | Schemas.SystemSubscriptionPropertiesDTO
  | Schemas.WebhookPropertiesDTO
  | Schemas.CamelPropertiesDTO
  | Schemas.PagerDutyPropertiesDTO;

export const toIntegrationProperties = (
  integration: Integration | NewIntegration
): ServerIntegrationProperties => {
  const type = integration.type;

  if (isCamelType(type)) {
    const integrationCamel: IntegrationCamel = integration as IntegrationCamel;
    return {
      url: integrationCamel.url,
      disableSslVerification: !integrationCamel.sslVerificationEnabled,
      secretToken: toSecretToken(integrationCamel.secretToken),
      basicAuthentication: integrationCamel.basicAuth
        ? {
            username: integrationCamel.basicAuth.user,
            password: integrationCamel.basicAuth.pass,
          }
        : undefined,
      extras: integrationCamel.extras,
    };
  }

  switch (type) {
    case IntegrationType.WEBHOOK: {
      const integrationHttp: IntegrationHttp = integration as IntegrationHttp;
      return {
        url: integrationHttp.url,
        method: integrationHttp.method,
        disableSslVerification: !integrationHttp.sslVerificationEnabled,
        secretToken: toSecretToken(integrationHttp.secretToken),
      };
    }
    case IntegrationType.ANSIBLE: {
      const integrationAnsible = integration as IntegrationAnsible;
      return {
        url: integrationAnsible.url,
        disableSslVerification: !integrationAnsible.sslVerificationEnabled,
        secretToken: toSecretToken(integrationAnsible.secretToken),
        method: integrationAnsible.method,
      };
    }
    case IntegrationType.EMAIL_SUBSCRIPTION: {
      const integrationEmail: IntegrationEmailSubscription =
        integration as IntegrationEmailSubscription;
      return {
        onlyAdmins: integrationEmail.onlyAdmin,
        groupId: integrationEmail.groupId,
        ignorePreferences: integrationEmail.ignorePreferences,
      };
    }
    case IntegrationType.DRAWER: {
      const integrationDrawer: IntegrationDrawer =
        integration as IntegrationDrawer;
      return {
        onlyAdmins: integrationDrawer.onlyAdmin,
        groupId: integrationDrawer.groupId,
        ignorePreferences: integrationDrawer.ignorePreferences,
      };
    }
    case IntegrationType.PAGERDUTY: {
      const integrationPagerDuty: IntegrationPagerduty =
        integration as IntegrationPagerduty;
      return {
        secretToken: integrationPagerDuty.secretToken,
        severity: integrationPagerDuty.severity,
      };
    }
    default:
      assertNever(type);
  }
};

export const toServerIntegrationRequest = (
  integration: Integration | NewIntegration
): ServerIntegrationRequest => {
  const { type, subType } = getEndpointType(integration.type);
  return {
    id: integration.id,
    name: integration.name,
    enabled: integration.isEnabled,
    type,
    sub_type: subType,
    description: '',
    properties: toIntegrationProperties(integration),
  };
};
