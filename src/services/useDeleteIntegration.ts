import { useMutation } from 'react-fetching-library';

import { Operations } from '../generated/OpenapiIntegrations';

export const deleteIntegrationActionCreator = (integrationId: string) => {
  return Operations.EndpointResource$v1DeleteEndpoint.actionCreator({
    id: integrationId,
  });
};

export const useDeleteIntegration = () =>
  useMutation<boolean>(deleteIntegrationActionCreator);
