import { Operations } from '../../generated/OpenapiIntegrations';
import { NotificationType, SystemProperties } from '../../types/Notification';

export const getDefaultSystemEndpointAction = (props: SystemProperties) => {
    if (props.type !== NotificationType.EMAIL_SUBSCRIPTION) {
        throw new Error('Only email subscriptions are allowed to be fetched');
    }

    return Operations.EndpointServiceGetOrCreateEmailSubscriptionEndpoint.actionCreator({
        body: {}
    });
};
