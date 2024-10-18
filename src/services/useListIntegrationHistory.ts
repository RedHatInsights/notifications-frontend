import { Operations } from '../generated/OpenapiIntegrations';

type IntegrationHistoryParams = {
  integrationId: string;
  limit?: number;
  sortBy?: 'created:desc';
  includeDetails?: boolean;
};

export const listIntegrationHistoryActionCreator = (
  params: IntegrationHistoryParams
) => {
  return Operations.EndpointResource$v1GetEndpointHistory.actionCreator({
    id: params.integrationId,
    limit: params.limit,
    sortBy: params.sortBy,
    includeDetail: params.includeDetails,
  });
};
