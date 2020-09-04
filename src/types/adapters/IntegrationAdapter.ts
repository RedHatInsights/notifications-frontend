import {
    Integration,
    IntegrationBase,
    IntegrationType,
    NewIntegration,
    ServerIntegrationRequest,
    ServerIntegrationResponse
} from '../Integration';
import { assertNever } from '@redhat-cloud-services/insights-common-typescript';
import { EndpointType, HttpType, WebhookAttributes } from '../../generated/Types';

const getIntegrationType = (type: EndpointType | undefined): IntegrationType => {
    switch (type) {
        case EndpointType.webhook:
            return IntegrationType.WEBHOOK;
        case EndpointType.email:
        case undefined:
            throw new Error(`Unexpected type: ${type}`);
        default:
            assertNever(type);
    }
};

const getEndpointType = (type: IntegrationType): EndpointType => {
    switch (type) {
        case IntegrationType.WEBHOOK:
            return EndpointType.webhook;
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
            const properties = serverIntegration.properties as WebhookAttributes;
            return {
                ...integrationBase,
                url: properties.url || '',
                sslVerificationEnabled: !properties.disable_ssl_verification,
                secretToken: properties.secret_token === null ? undefined : properties.secret_token,
                method: properties.method || HttpType.GET
            };
        default:
            assertNever(integrationBase.type);
    }
};

export const toIntegrations = (serverIntegrations?: Array<ServerIntegrationResponse>): Array<Integration> => {
    return (serverIntegrations || []).map(toIntegration);
};

export const toIntegrationProperties = (integration: Integration | NewIntegration) => {
    switch (integration.type) {
        case IntegrationType.WEBHOOK:
            return {
                url: integration.url,
                // Todo: Add these to IntegrationHttp
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
