import { assertNever } from 'assert-never';

import { Schemas } from '../../generated/OpenapiIntegrations';
import {
    Integration,
    IntegrationBase,
    IntegrationCamel, IntegrationEmailSubscription,
    IntegrationHttp,
    IntegrationType,
    NewIntegration,
    ServerIntegrationRequest,
    ServerIntegrationResponse
} from '../Integration';

const getIntegrationType = (type: Schemas.EndpointType | undefined): IntegrationType => {
    switch (type) {
        case Schemas.EndpointType.Enum.camel:
            return IntegrationType.CAMEL;
        case Schemas.EndpointType.Enum.webhook:
            return IntegrationType.WEBHOOK;
        case Schemas.EndpointType.Enum.email_subscription:
            return IntegrationType.EMAIL_SUBSCRIPTION;
        case Schemas.EndpointType.Enum.default:
        case undefined:
            throw new Error(`Unexpected type: ${type}`);
        default:
            assertNever(type);
    }
};

export const getEndpointType = (type: IntegrationType): Schemas.EndpointType => {
    switch (type) {
        case IntegrationType.WEBHOOK:
            return Schemas.EndpointType.Enum.webhook;
        case IntegrationType.CAMEL:
            return Schemas.EndpointType.Enum.camel;
        case IntegrationType.EMAIL_SUBSCRIPTION:
            return Schemas.EndpointType.Enum.email_subscription;
        default:
            assertNever(type);
    }
};

type NotNullType = {
    <T>(value: T | undefined | null): T | undefined;
    <T>(value: T | undefined | null, defaultValue: T): T;
}

const notNull: NotNullType = <T>(value: T | undefined | null, defaultValue?: T): T | undefined => value === null ? defaultValue : value;

const toIntegrationWebhook = (
    integrationBase: IntegrationBase<IntegrationType.WEBHOOK>,
    properties?: Schemas.WebhookProperties): IntegrationHttp => ({
    ...integrationBase,
    url: properties?.url ?? '',
    sslVerificationEnabled: !properties?.disable_ssl_verification ?? false,
    secretToken: notNull(properties?.secret_token),
    method: properties?.method ?? Schemas.HttpType.Enum.GET
});

const toIntegrationCamel = (
    integrationBase: IntegrationBase<IntegrationType.CAMEL>,
    properties?: Schemas.CamelProperties): IntegrationCamel => ({
    ...integrationBase,
    url: properties?.url ?? '',
    sslVerificationEnabled: !properties?.disable_ssl_verification ?? false,
    secretToken: notNull(properties?.secret_token),

    subType: notNull(properties?.sub_type),
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
        type: getIntegrationType(serverIntegration.type)
    };

    switch (integrationBase.type) {
        case IntegrationType.WEBHOOK:
            return toIntegrationWebhook(
                integrationBase as IntegrationBase<IntegrationType.WEBHOOK>,
                serverIntegration.properties as Schemas.WebhookProperties
            );

        case IntegrationType.CAMEL: {
            return toIntegrationCamel(
                integrationBase as IntegrationBase<IntegrationType.CAMEL>,
                serverIntegration.properties as Schemas.CamelProperties
            );
        }

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
    return filterOutDefaultAction(serverIntegrations).map(toIntegration);
};

type ServerIntegrationProperties = Schemas.EmailSubscriptionProperties | Schemas.WebhookProperties | Schemas.CamelProperties

export const toIntegrationProperties = (integration: Integration | NewIntegration): ServerIntegrationProperties => {
    switch (integration.type) {
        case IntegrationType.WEBHOOK:
            const integrationHttp: IntegrationHttp = integration as IntegrationHttp;
            return {
                url: integrationHttp.url,
                method: integrationHttp.method,
                disable_ssl_verification: !integrationHttp.sslVerificationEnabled,
                secret_token: integrationHttp.secretToken
            };
        case IntegrationType.CAMEL:
            const integrationCamel: IntegrationCamel = integration as IntegrationCamel;
            return {
                url: integrationCamel.url,
                disable_ssl_verification: !integrationCamel.sslVerificationEnabled,
                secret_token: integrationCamel.secretToken,
                sub_type: integrationCamel.subType,
                basic_authentication: {
                    username: integrationCamel.basicAuth?.user,
                    password: integrationCamel.basicAuth?.pass
                },
                extras: integrationCamel.extras
            };
        case IntegrationType.EMAIL_SUBSCRIPTION:
            const integrationEmail: IntegrationEmailSubscription = integration as IntegrationEmailSubscription;
            return {
                only_admins: integrationEmail.onlyAdmin,
                group_id: integrationEmail.groupId,
                ignore_preferences: integrationEmail.ignorePreferences
            };
        default:
            assertNever(integration);
    }
};

export const toServerIntegrationRequest =
    (integration: Integration | NewIntegration): ServerIntegrationRequest => {
        return {
            id: integration.id,
            name: integration.name,
            enabled: integration.isEnabled,
            type: getEndpointType(integration.type),
            description: '',
            properties: toIntegrationProperties(integration)
        };
    };

export const filterOutDefaultAction = (serverNotifications: Array<ServerIntegrationResponse>) =>
    serverNotifications.filter(e => e.type !== Schemas.EndpointType.enum.default);
