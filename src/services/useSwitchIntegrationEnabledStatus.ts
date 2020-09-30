import { Integration, ServerIntegrationResponse } from '../types/Integration';
import {
    actionDeleteEndpointsByIdEnable,
    actionPutEndpointsByIdEnable
} from '../generated/Openapi';
import { useMutation } from 'react-fetching-library';

export const switchIntegrationEnabledStatusActionCreator = (integration: Integration) => {
    if (integration.isEnabled) {
        return actionDeleteEndpointsByIdEnable({
            id: integration.id
        });
    } else {
        return actionPutEndpointsByIdEnable({
            id: integration.id
        });
    }
};

export const useSwitchIntegrationEnabledStatus =
    () => useMutation<ServerIntegrationResponse>(switchIntegrationEnabledStatusActionCreator);
