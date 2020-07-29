import { Integration, IntegrationType, ServerIntegrationResponse } from '../Integration';
import { EndpointType } from '../../generated/Types';

const toIntegrationType = (serverIntegrationType: EndpointType): IntegrationType => {
    if (serverIntegrationType === EndpointType.WEBHOOK) {
        return IntegrationType.HTTP;
    } else if (serverIntegrationType === EndpointType.EMAIL) {
        return IntegrationType.HTTP;
    }

    throw new Error('Invalid EndpointType received');
};

export const toIntegration = (serverIntegration: ServerIntegrationResponse): Integration => {
    return {
        id: serverIntegration.id || '',
        name: serverIntegration.name || '',
        isEnabled: !!serverIntegration.enabled,
        type: toIntegrationType(serverIntegration.type || EndpointType.WEBHOOK),
        url: (serverIntegration.properties as any)?.url ?? 'dummy-url'
    };
};

export const toIntegrations = (serverIntegrations?: Array<ServerIntegrationResponse>): Array<Integration> => {
    return (serverIntegrations || []).map(toIntegration);
};
