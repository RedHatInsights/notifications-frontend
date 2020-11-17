import {
    Operations, Schemas
} from '../../generated/OpenapiIntegrations';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';

export const getDefaultActionIdAction = () => Operations.EndpointServiceCreateEndpoint.actionCreator({
    body: {
        type: Schemas.EndpointType.enum.default,
        name: 'Default endpoint type',
        description: '',
        enabled: true,
        properties: null
    }
});

export const getDefaultActionIdDecoder = validationResponseTransformer((payload: Operations.EndpointServiceCreateEndpoint.Payload) => {
    if (payload.type === 'Endpoint') {
        return validatedResponse(
            'DefaultNotificationId',
            payload.status,
            payload.value.id as string,
            payload.errors
        );
    }

    return payload;
});
