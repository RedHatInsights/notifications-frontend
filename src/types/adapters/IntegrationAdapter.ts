import { assertNever } from 'assert-never';

import { Schemas } from '../../generated/OpenapiIntegrations';
import {
    Integration,
    IntegrationBase,
    IntegrationHttp,
    IntegrationType,
    NewIntegration,
    NewUserIntegration,
    ServerIntegrationRequest,
    ServerIntegrationResponse,
    UserIntegration,
    UserIntegrationType
} from '../Integration';

const getIntegrationType = (type: Schemas.EndpointType | undefined): IntegrationType => {
    switch (type) {
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

export const getEndpointType = (type: IntegrationType | UserIntegrationType): Schemas.EndpointType => {
    switch (type) {
        case IntegrationType.WEBHOOK:
        case UserIntegrationType.WEBHOOK:
            return Schemas.EndpointType.Enum.webhook;
        case IntegrationType.EMAIL_SUBSCRIPTION:
            return Schemas.EndpointType.Enum.email_subscription;
        default:
            assertNever(type);
    }
};

export const toIntegration = (serverIntegration: ServerIntegrationResponse): Integration => {

    const integrationBase: IntegrationBase = {
        id: serverIntegration.id || '',
        name: serverIntegration.name || '',
        isEnabled: !!serverIntegration.enabled,
        type: getIntegrationType(serverIntegration.type)
    };

    switch (integrationBase.type) {
        case IntegrationType.WEBHOOK:
            const properties = serverIntegration.properties as Schemas.WebhookProperties;
            return {
                ...integrationBase,
                url: properties.url || '',
                sslVerificationEnabled: !properties.disable_ssl_verification,
                secretToken: properties.secret_token === null ? undefined : properties.secret_token,
                method: properties.method ?? Schemas.HttpType.Enum.GET
            };
        case IntegrationType.EMAIL_SUBSCRIPTION:
            return {
                ...integrationBase,
                type: IntegrationType.EMAIL_SUBSCRIPTION
            };
        default:
            assertNever(integrationBase.type);
    }
};

export const toUserIntegration = (serverIntegration: ServerIntegrationResponse): UserIntegration => {
    const integration = toIntegration(serverIntegration);
    if (!Object.values(UserIntegrationType).includes(integration.type as unknown as UserIntegrationType)) {
        throw new Error(`Unknown UserIntegrationType ${integration.type}`);
    }

    return integration as unknown as UserIntegration;
};

export const toUserIntegrations = (serverIntegrations: Array<ServerIntegrationResponse>): Array<UserIntegration> => {
    return toIntegrations(serverIntegrations)
    .filter(
        integration => Object.values(UserIntegrationType)
        .includes(integration.type as unknown as UserIntegrationType)) as unknown as Array<UserIntegration>;
};

export const toIntegrations = (serverIntegrations: Array<ServerIntegrationResponse>): Array<Integration> => {
    return filterOutDefaultAction(serverIntegrations).map(toIntegration);
};

export const toIntegrationProperties = (integration: Integration | NewIntegration | UserIntegration | NewUserIntegration) => {
    switch (integration.type) {
        case IntegrationType.WEBHOOK:
        case UserIntegrationType.WEBHOOK:
            const integrationHttp: IntegrationHttp = integration as IntegrationHttp;
            return {
                url: integrationHttp.url,
                method: integrationHttp.method,
                disable_ssl_verification: !integrationHttp.sslVerificationEnabled,
                secret_token: integrationHttp.secretToken
            };
        case IntegrationType.EMAIL_SUBSCRIPTION:
            return {};
        default:
            assertNever(integration);
    }
};

export const toServerIntegrationRequest =
    (integration: Integration | NewIntegration | UserIntegration | NewUserIntegration): ServerIntegrationRequest => {
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
