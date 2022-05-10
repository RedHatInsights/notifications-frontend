import assertNever from 'assert-never';

import { Operations } from '../../generated/OpenapiIntegrations';
import { NotificationType, SystemProperties } from '../../types/Notification';

export const getDefaultSystemEndpointAction = (systemProperties: SystemProperties) => {
    if (systemProperties.type === NotificationType.EMAIL_SUBSCRIPTION) {
        return Operations.EndpointResourceGetOrCreateEmailSubscriptionEndpoint.actionCreator({
            body: {
                onlyAdmins: systemProperties.props.onlyAdmins,
                groupId: systemProperties.props.groupId
            }
        });
    }

    assertNever(systemProperties.type);
};
