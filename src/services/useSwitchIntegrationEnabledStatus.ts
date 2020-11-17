import { Integration, ServerIntegrationResponse } from '../types/Integration';
import {
    Operations
} from '../generated/OpenapiIntegrations';
import { useMutation } from 'react-fetching-library';

export const switchIntegrationEnabledStatusActionCreator = (integration: Integration) => {
    if (integration.isEnabled) {
        return Operations.EndpointServiceDisableEndpoint.actionCreator({
            id: integration.id
        });
    } else {
        return Operations.EndpointServiceEnableEndpoint.actionCreator({
            id: integration.id
        });
    }
};

export const useSwitchIntegrationEnabledStatus =
    () => useMutation<ServerIntegrationResponse>(switchIntegrationEnabledStatusActionCreator);
