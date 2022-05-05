import { Operations } from '../../generated/OpenapiIntegrations';
import { UUID } from '../../types/Notification';

export const getEndpointAction = (id: UUID) => {
    return Operations.EndpointResourceGetEndpoint.actionCreator({
        id
    });
};
