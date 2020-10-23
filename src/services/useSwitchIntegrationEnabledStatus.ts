import { Integration, ServerIntegrationResponse } from '../types/Integration';
import {
    actionEndpointServiceEnableEndpoint,
    actionEndpointServiceDisableEndpoint
} from '../generated/OpenapiIntegrations';
import { useMutation } from 'react-fetching-library';

export const switchIntegrationEnabledStatusActionCreator = (integration: Integration) => {
    if (integration.isEnabled) {
        return actionEndpointServiceDisableEndpoint({
            id: integration.id
        });
    } else {
        return actionEndpointServiceEnableEndpoint({
            id: integration.id
        });
    }
};

export const useSwitchIntegrationEnabledStatus =
    () => useMutation<ServerIntegrationResponse>(switchIntegrationEnabledStatusActionCreator);
