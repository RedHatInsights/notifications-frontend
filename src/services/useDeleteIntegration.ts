import { actionDeleteApiNotificationsV10EndpointsId } from '../generated/Openapi';
import { useMutation } from 'react-fetching-library';

const deleteIntegrationActionCreator = (integrationId: string) => {
    return actionDeleteApiNotificationsV10EndpointsId({
        id: integrationId
    });
};

export const useDeleteIntegration = () => useMutation<boolean>(deleteIntegrationActionCreator);
