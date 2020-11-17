import {
    Integration,
    IntegrationBase,
    IntegrationType,
    NewIntegration,
    ServerIntegrationRequest,
    ServerIntegrationResponse
} from '../Integration';
import { Schemas } from '../../generated/OpenapiIntegrations';
import { assertNever } from 'assert-never';

const getIntegrationType = (type: Schemas.EndpointType | undefined): IntegrationType => {
    switch (type) {
        case Schemas.EndpointType.Enum.webhook:
            return IntegrationType.WEBHOOK;
        case Schemas.EndpointType.Enum.email:
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
            const properties = serverIntegration.properties as Schemas.WebhookAttributes;
            return {
                ...integrationBase,
                url: properties.url || '',
                sslVerificationEnabled: !properties.disable_ssl_verification,
                secretToken: properties.secret_token === null ? undefined : properties.secret_token,
                method: properties.method ?? Schemas.HttpType.Enum.GET
            };
        default:
            assertNever(integrationBase.type);
    }
};

export const toIntegrations = (serverIntegrations: Array<ServerIntegrationResponse>): Array<Integration> => {
    return filterOutDefaultAction(serverIntegrations).map(toIntegration);
};

export const toIntegrationProperties = (integration: Integration | NewIntegration) => {
    switch (integration.type) {
        case IntegrationType.WEBHOOK:
            return {
                url: integration.url,
                method: integration.method,
                disable_ssl_verification: !integration.sslVerificationEnabled,
                secret_token: integration.secretToken
            };
        default:
            assertNever(integration.type);
    }
};

export const toServerIntegrationRequest = (integration: Integration | NewIntegration): ServerIntegrationRequest => {
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
