import assertNever from 'assert-never';

import { Operations } from '../../generated/OpenapiIntegrations';
import { NotificationType, SystemProperties } from '../../types/Notification';

export const getDefaultSystemEndpointAction = (systemProperties: SystemProperties) => {
    if (systemProperties.type === NotificationType.EMAIL_SUBSCRIPTION) {
        return Operations.EndpointServiceGetOrCreateEmailSubscriptionEndpoint.actionCreator({
            body: {
                only_admins: systemProperties.props.onlyAdmins
            }
        });
    }

    assertNever(systemProperties.type);
};
