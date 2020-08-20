import {
    Integration,
    IntegrationType,
    NewIntegration,
    ServerIntegrationRequest,
    ServerIntegrationResponse
} from '../Integration';
import { assertNever } from '@redhat-cloud-services/insights-common-typescript';
import { EndpointType } from '../../generated/Types';

const getIntegrationType = (type: EndpointType): IntegrationType => {
    switch (type) {
        case EndpointType.webhook:
            return IntegrationType.WEBHOOK;
        case EndpointType.email:
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
    return {
        id: serverIntegration.id || '',
        name: serverIntegration.name || '',
        isEnabled: !!serverIntegration.enabled,
        type: getIntegrationType(serverIntegration.type || EndpointType.webhook),
        url: (serverIntegration.properties as any)?.url ?? 'dummy-url'
    };
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
                method: 'GET',
                disable_ssl_verification: false,
                secret_token: ''
            };
        default:
            assertNever(integration.type);
    }
};

export const toServerIntegrationRequest = (integration: Integration | NewIntegration): ServerIntegrationRequest => {
    return {
        id: integration.id,
        name: integration.name,
        enabled: !!integration.isEnabled,
        type: getEndpointType(integration.type),
        description: '',
        properties: toIntegrationProperties(integration)
    };
};
