import { Integration, ServerIntegrationResponse } from '../types/Integration';
import {
    actionDeleteApiNotificationsV10EndpointsIdEnable,
    actionPutApiNotificationsV10EndpointsIdEnable
} from '../generated/Openapi';
import { useMutation } from 'react-fetching-library';

export const switchIntegrationEnabledStatusActionCreator = (integration: Integration) => {
    if (integration.isEnabled) {
        return actionDeleteApiNotificationsV10EndpointsIdEnable({
            id: integration.id
        });
    } else {
        return actionPutApiNotificationsV10EndpointsIdEnable({
            id: integration.id
        });
    }
};

export const useSwitchIntegrationEnabledStatus =
    () => useMutation<ServerIntegrationResponse>(switchIntegrationEnabledStatusActionCreator);
