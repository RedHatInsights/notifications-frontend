import { Operations } from '../../generated/OpenapiIntegrations';
import { UUID } from '../../types/Notification';

export const getEndpointAction = (id: UUID) => {
  return Operations.EndpointResource$v1GetEndpoint.actionCreator({
    id,
  });
};
