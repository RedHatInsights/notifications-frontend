import { actionDeleteEndpointsById } from '../generated/Openapi';
import { useMutation } from 'react-fetching-library';

const deleteIntegrationActionCreator = (integrationId: string) => {
    return actionDeleteEndpointsById({
        id: integrationId
    });
};

export const useDeleteIntegration = () => useMutation<boolean>(deleteIntegrationActionCreator);
