import { RequestInterceptor, ResponseInterceptor, createClient } from 'react-fetching-library';

const getRefreshAuthTokenInterceptor =
  (getToken: () => Promise<string | undefined>): RequestInterceptor =>
  () =>
  async (action) => {
    await getToken();
    return action;
  };

interface FetchingClientOptions {
  requestInterceptors?: Array<RequestInterceptor>;
  responseInterceptors?: Array<ResponseInterceptor>;
}

export const createFetchingClient = (
  getToken: () => Promise<string | undefined>,
  options?: FetchingClientOptions
) =>
  createClient({
    requestInterceptors: [
      getRefreshAuthTokenInterceptor(getToken),
      ...(options?.requestInterceptors ?? []),
    ],
    responseInterceptors: [...(options?.responseInterceptors ?? [])],
  });
