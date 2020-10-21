import {
    actionEndpointServiceCreateEndpoint,
    EndpointServiceCreateEndpointPayload
} from '../../generated/OpenapiIntegrations';
import { EndpointType } from '../../generated/OpenapiIntegrations';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';

export const getDefaultActionIdAction = () => actionEndpointServiceCreateEndpoint({
    body: {
        type: EndpointType.enum.default,
        name: 'Default endpoint type',
        description: '',
        enabled: true,
        properties: null
    }
});

export const getDefaultActionIdDecoder = validationResponseTransformer((payload: EndpointServiceCreateEndpointPayload) => {
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
