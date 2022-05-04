import { useMutation } from 'react-fetching-library';

import {
    Operations
} from '../generated/OpenapiIntegrations';
import { Integration, ServerIntegrationResponse } from '../types/Integration';

export const switchIntegrationEnabledStatusActionCreator = (integration: Integration) => {
    if (integration.isEnabled) {
        return Operations.EndpointResourceDisableEndpoint.actionCreator({
            id: integration.id
        });
    } else {
        return Operations.EndpointResourceEnableEndpoint.actionCreator({
            id: integration.id
        });
    }
};

export const useSwitchIntegrationEnabledStatus =
    () => useMutation<ServerIntegrationResponse>(switchIntegrationEnabledStatusActionCreator);
