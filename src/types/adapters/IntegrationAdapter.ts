import { assertNever } from 'assert-never';

import { Schemas } from '../../generated/OpenapiIntegrations';
import {
    CamelIntegrationType,
    Integration,
    IntegrationAnsible,
    IntegrationBase,
    IntegrationCamel,
    IntegrationEmailSubscription,
    IntegrationHttp,
    IntegrationType, isCamelType,
    NewIntegration,
    ServerIntegrationRequest,
    ServerIntegrationResponse
} from '../Integration';

interface ExternalCompositeTyped {
    type: string;
    sub_type?: string | null;
}

export const getIntegrationType = (serverIntegration: ExternalCompositeTyped): IntegrationType => {
    for (const integration of Object.values(IntegrationType)) {
        if (serverIntegration.sub_type) {
            if (integration === `${serverIntegration.type}:${serverIntegration.sub_type}`) {
                return integration as IntegrationType;
            }
        } else if (integration === serverIntegration.type) {
            return integration as IntegrationType;
        }
    }

    throw new Error(`Unexpected type: ${serverIntegration.type} with subtype: ${serverIntegration.sub_type}`);
};

const getEndpointType = (type: IntegrationType): { type: Schemas.EndpointType, subType?: string } => {
    const splitType = type.split(':', 2);
    return {
        type: splitType[0] as Schemas.EndpointType,
        subType: splitType.length === 2 ? splitType[1] : undefined
    };
};

type NotNullType = {
    <T>(value: T | undefined | null): T | undefined;
    <T>(value: T | undefined | null, defaultValue: T): T;
}

const notNull: NotNullType = <T>(value: T | undefined | null, defaultValue?: T): T | undefined => value === null ? defaultValue : value;
const toSecretToken = (secretToken: string | undefined | null): string | undefined => secretToken === '' ? undefined : notNull(secretToken);

const toIntegrationWebhook = (
    integrationBase: IntegrationBase<IntegrationType.WEBHOOK>,
    properties?: Schemas.WebhookProperties): IntegrationHttp => ({
    ...integrationBase,
    url: properties?.url ?? '',
    sslVerificationEnabled: !properties?.disable_ssl_verification ?? false,
    secretToken: toSecretToken(properties?.secret_token),
    method: properties?.method ?? Schemas.HttpType.Enum.GET
});

const toIntegrationAnsible = (
    integrationBase: IntegrationBase<IntegrationType.ANSIBLE>,
    properties?: Schemas.WebhookProperties): IntegrationAnsible => ({
    ...integrationBase,
    url: properties?.url ?? '',
    sslVerificationEnabled: !properties?.disable_ssl_verification ?? false,
    method: properties?.method ?? Schemas.HttpType.Enum.POST
});

const toIntegrationCamel = (
    integrationBase: IntegrationBase<CamelIntegrationType>,
    properties?: Schemas.CamelProperties): IntegrationCamel => ({
    ...integrationBase,
    url: properties?.url ?? '',
    sslVerificationEnabled: !properties?.disable_ssl_verification ?? false,
    secretToken: toSecretToken(properties?.secret_token),
    basicAuth: properties?.basic_authentication === null ?
        undefined
        :
        {
            user: notNull(properties?.basic_authentication?.username, ''),
            pass: notNull(properties?.basic_authentication?.password, '')
        },
    extras: notNull(properties?.extras)
});

const toIntegrationEmail = (
    integrationBase: IntegrationBase<IntegrationType.EMAIL_SUBSCRIPTION>,
    properties: Schemas.EmailSubscriptionProperties): IntegrationEmailSubscription => ({
    ...integrationBase,
    ignorePreferences: properties.ignore_preferences,
    groupId: properties.group_id === null ? undefined : properties.group_id,
    onlyAdmin: properties.only_admins
});

export const toIntegration = (serverIntegration: ServerIntegrationResponse): Integration => {

    const integrationBase: IntegrationBase<IntegrationType> = {
        id: serverIntegration.id || '',
        name: serverIntegration.name || '',
        isEnabled: !!serverIntegration.enabled,
        type: getIntegrationType(serverIntegration),
        status: serverIntegration.status ?? 'UNKNOWN',
        serverErrors: serverIntegration.server_errors ?? 0
    };

    if (isCamelType(integrationBase.type)) {
        return toIntegrationCamel(
            integrationBase as IntegrationBase<CamelIntegrationType>,
            serverIntegration.properties as Schemas.CamelProperties
        );
    }

    switch (integrationBase.type) {
        case IntegrationType.WEBHOOK:
            return toIntegrationWebhook(
                integrationBase as IntegrationBase<IntegrationType.WEBHOOK>,
                serverIntegration.properties as Schemas.WebhookProperties
            );
        case IntegrationType.ANSIBLE:
            return toIntegrationAnsible(
                integrationBase as IntegrationBase<IntegrationType.ANSIBLE>,
                serverIntegration.properties as Schemas.WebhookProperties
            );
        case IntegrationType.EMAIL_SUBSCRIPTION:
            return toIntegrationEmail(
                integrationBase as IntegrationBase<IntegrationType.EMAIL_SUBSCRIPTION>,
                serverIntegration.properties as Schemas.EmailSubscriptionProperties
            );
        default:
            assertNever(integrationBase.type);
    }
};

export const toIntegrations = (serverIntegrations: Array<ServerIntegrationResponse>): Array<Integration> => {
    return serverIntegrations
    .map(toIntegration);
};

type ServerIntegrationProperties = Schemas.EmailSubscriptionProperties | Schemas.WebhookProperties | Schemas.CamelProperties

export const toIntegrationProperties = (integration: Integration | NewIntegration): ServerIntegrationProperties => {

    const type = integration.type;

    if (isCamelType(type)) {
        const integrationCamel: IntegrationCamel = integration as IntegrationCamel;
        return {
            url: integrationCamel.url,
            disable_ssl_verification: !integrationCamel.sslVerificationEnabled,
            secret_token: toSecretToken(integrationCamel.secretToken),
            basic_authentication: integrationCamel.basicAuth ? {
                username: integrationCamel.basicAuth.user,
                password: integrationCamel.basicAuth.pass
            } : undefined,
            extras: integrationCamel.extras
        };
    }

    switch (type) {
        case IntegrationType.WEBHOOK:
            const integrationHttp: IntegrationHttp = integration as IntegrationHttp;
            return {
                url: integrationHttp.url,
                method: integrationHttp.method,
                disable_ssl_verification: !integrationHttp.sslVerificationEnabled,
                secret_token: toSecretToken(integrationHttp.secretToken)
            };
        case IntegrationType.ANSIBLE:
            const integrationAnsible = integration as IntegrationAnsible;
            return {
                url: integrationAnsible.url,
                disable_ssl_verification: !integrationAnsible.sslVerificationEnabled,
                method: integrationAnsible.method
            };
        case IntegrationType.EMAIL_SUBSCRIPTION:
            const integrationEmail: IntegrationEmailSubscription = integration as IntegrationEmailSubscription;
            return {
                only_admins: integrationEmail.onlyAdmin,
                group_id: integrationEmail.groupId,
                ignore_preferences: integrationEmail.ignorePreferences
            };
        default:
            assertNever(type);
    }
};

export const toServerIntegrationRequest =
    (integration: Integration | NewIntegration): ServerIntegrationRequest => {
        const { type, subType } = getEndpointType(integration.type);
        return {
            id: integration.id,
            name: integration.name,
            enabled: integration.isEnabled,
            type,
            sub_type: subType,
            description: '',
            properties: toIntegrationProperties(integration)
        };
    };
