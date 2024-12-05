import axios from 'axios';
import {
  errorInterceptor,
  interceptor500,
  responseDataInterceptor,
} from '@redhat-cloud-services/frontend-components-utilities/interceptors';

// Notifications endpoints
import getBundleFacets from '@redhat-cloud-services/notifications-client/dist/NotificationResourceV1GetBundleFacets';
import getEventTypes from '@redhat-cloud-services/notifications-client/dist/NotificationResourceV1GetEventTypes';

// Integrations endpoints
import createEndpoint from '@redhat-cloud-services/integrations-client/dist/EndpointResourceV1CreateEndpoint';
import updateEndpoint from '@redhat-cloud-services/integrations-client/dist/EndpointResourceV1UpdateEndpoint';
import getEndpoint from '@redhat-cloud-services/integrations-client/dist/v2/EndpointResourceV2GetEndpoint';

// Time config endpoints
import getTimePreference from '@redhat-cloud-services/notifications-client/dist/OrgConfigResourceV1GetDailyDigestTimePreference';
import putTimePreference from '@redhat-cloud-services/notifications-client/dist/OrgConfigResourceV1SaveDailyDigestTimePreference';

import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared';
import { INTEGRATIONS_API_BASE, NOTIFICATIONS_API_BASE } from './constants';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(responseDataInterceptor);
axiosInstance.interceptors.response.use(null, interceptor500);
axiosInstance.interceptors.response.use(null, errorInterceptor);

const notificationsApi = new APIFactory(
  NOTIFICATIONS_API_BASE,
  {
    getBundleFacets,
    getEventTypes,
    getTimePreference,
    putTimePreference,
  },
  { axios: axiosInstance }
);

const integrationsApi = new APIFactory(
  INTEGRATIONS_API_BASE,
  {
    createEndpoint,
    updateEndpoint,
    getEndpoint,
  },
  { axios: axiosInstance }
);

// Exported APIs
export function getNotificationsApi() {
  return notificationsApi;
}

export function getIntegrationsApi() {
  return integrationsApi;
}
