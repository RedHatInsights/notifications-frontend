import {
  RequestInterceptor,
  ResponseInterceptor,
  createClient,
} from 'react-fetching-library';
import { InsightsType } from './InsightsType';

const getRefreshAuthTokenInterceptor =
  (getInsights: () => InsightsType): RequestInterceptor =>
  () =>
  (action) => {
    return getInsights()
      .chrome.auth.getUser()
      .then(() => action);
  };

interface FetchingClientOptions {
  requestInterceptors?: Array<RequestInterceptor>;
  responseInterceptors?: Array<ResponseInterceptor>;
}

export const createFetchingClient = (
  getInsights: () => InsightsType,
  options?: FetchingClientOptions
) =>
  createClient({
    requestInterceptors: [
      getRefreshAuthTokenInterceptor(getInsights),
      ...(options?.requestInterceptors ?? []),
    ],
    responseInterceptors: [...(options?.responseInterceptors ?? [])],
  });
