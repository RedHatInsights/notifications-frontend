import { assertNever } from 'assert-never';

import { Schemas } from '../../generated/OpenapiIntegrations';
import {
    CamelIntegrationType,
    Integration,
    IntegrationBase,
    IntegrationCamel,
    IntegrationEmailSubscription,
    IntegrationHttp,
    IntegrationType,
    NewIntegration,
    ServerIntegrationRequest,
    ServerIntegrationResponse
} from '../Integration';

const CAMEL_SUBTYPE_SPLUNK = 'splunk';
const CAMEL_SUBTYPES = [
    CAMEL_SUBTYPE_SPLUNK
];

const getIntegrationType = (serverIntegration: ServerIntegrationResponse): IntegrationType => {
    switch (serverIntegration.type) {
        case Schemas.EndpointType.Enum.camel:
            const subType = (serverIntegration.properties as Schemas.CamelProperties).sub_type;
            if (subType === CAMEL_SUBTYPE_SPLUNK) {
                return IntegrationType.SPLUNK;
            }

            throw new Error(`Unexpected type: ${serverIntegration.type} with subtype: ${subType}`);
        case Schemas.EndpointType.Enum.webhook:
            return IntegrationType.WEBHOOK;
        case Schemas.EndpointType.Enum.email_subscription:
            return IntegrationType.EMAIL_SUBSCRIPTION;
        case Schemas.EndpointType.Enum.default:
        case undefined:
            throw new Error(`Unexpected type: ${serverIntegration.type}`);
        default:
            assertNever(serverIntegration.type);
    }
};

export const getEndpointType = (type: IntegrationType): Schemas.EndpointType => {
    switch (type) {
        case IntegrationType.WEBHOOK:
            return Schemas.EndpointType.Enum.webhook;
        case IntegrationType.SPLUNK:
            return Schemas.EndpointType.Enum.camel;
        case IntegrationType.EMAIL_SUBSCRIPTION:
            return Schemas.EndpointType.Enum.email_subscription;
        default:
            assertNever(type);
    }
};

export const getCamelEndpointSubType = (type: CamelIntegrationType): string => {
    switch (type) {
        case IntegrationType.SPLUNK:
            return CAMEL_SUBTYPE_SPLUNK;
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
    integrationBase: IntegrationBase<CamelIntegrationType>,
    properties?: Schemas.CamelProperties): IntegrationCamel => ({
    ...integrationBase,
    url: properties?.url ?? '',
    sslVerificationEnabled: !properties?.disable_ssl_verification ?? false,
    secretToken: notNull(properties?.secret_token),
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
        type: getIntegrationType(serverIntegration)
    };

    switch (integrationBase.type) {
        case IntegrationType.WEBHOOK:
            return toIntegrationWebhook(
                integrationBase as IntegrationBase<IntegrationType.WEBHOOK>,
                serverIntegration.properties as Schemas.WebhookProperties
            );

        case IntegrationType.SPLUNK: {
            return toIntegrationCamel(
                integrationBase as IntegrationBase<CamelIntegrationType>,
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
    return serverIntegrations
    .filter(filterOutDefaultAction)
    .filter(filterOutUnknownCamel)
    .map(toIntegration);
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
        case IntegrationType.SPLUNK:
            const integrationCamel: IntegrationCamel = integration as IntegrationCamel;
            return {
                url: integrationCamel.url,
                disable_ssl_verification: !integrationCamel.sslVerificationEnabled,
                secret_token: integrationCamel.secretToken,
                sub_type: getCamelEndpointSubType(integration.type),
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

export const filterOutDefaultAction = (serverNotification: ServerIntegrationResponse) =>
    serverNotification.type !== Schemas.EndpointType.enum.default;

export const filterOutUnknownCamel = (serverNotification: ServerIntegrationResponse) =>
    serverNotification.type !== Schemas.EndpointType.Enum.camel ||
    CAMEL_SUBTYPES.includes((serverNotification.properties as Schemas.CamelProperties).sub_type || '');
