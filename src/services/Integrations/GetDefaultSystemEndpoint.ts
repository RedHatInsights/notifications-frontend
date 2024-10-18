import assertNever from 'assert-never';

import { Operations } from '../../generated/OpenapiIntegrations';
import {
  SystemProperties,
  isDrawerSystemProperties,
  isEmailSystemProperties,
} from '../../types/Notification';

export const getDefaultSystemEndpointAction = (
  systemProperties: SystemProperties
) => {
  if (isEmailSystemProperties(systemProperties)) {
    return Operations.EndpointResource$v1GetOrCreateEmailSubscriptionEndpoint.actionCreator(
      {
        body: {
          only_admins: systemProperties.props.onlyAdmins,
          group_id: systemProperties.props.groupId,
        },
      }
    );
  } else if (isDrawerSystemProperties(systemProperties)) {
    return Operations.EndpointResource$v1GetOrCreateDrawerSubscriptionEndpoint.actionCreator(
      {
        body: {
          only_admins: systemProperties.props.onlyAdmins,
          group_id: systemProperties.props.groupId,
        },
      }
    );
  }

  assertNever(systemProperties);
};
