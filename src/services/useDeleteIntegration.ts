import { Operations } from '../generated/OpenapiIntegrations';
import { useMutation } from 'react-fetching-library';

const deleteIntegrationActionCreator = (integrationId: string) => {
    return Operations.EndpointServiceDeleteEndpoint.actionCreator({
        id: integrationId
    });
};

export const useDeleteIntegration = () => useMutation<boolean>(deleteIntegrationActionCreator);
