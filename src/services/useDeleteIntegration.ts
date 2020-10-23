import { actionEndpointServiceDeleteEndpoint } from '../generated/OpenapiIntegrations';
import { useMutation } from 'react-fetching-library';

const deleteIntegrationActionCreator = (integrationId: string) => {
    return actionEndpointServiceDeleteEndpoint({
        id: integrationId
    });
};

export const useDeleteIntegration = () => useMutation<boolean>(deleteIntegrationActionCreator);
