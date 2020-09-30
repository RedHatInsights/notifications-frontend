import { actionGetEndpointsByIdHistory } from '../generated/Openapi';

export const listIntegrationHistoryActionCreator = (integrationId: string) => {
    return actionGetEndpointsByIdHistory({
        id: integrationId
    });
};
