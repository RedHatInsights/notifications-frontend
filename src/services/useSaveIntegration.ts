import { useMutation } from 'react-fetching-library';
import { Operations, Schemas } from '../generated/OpenapiIntegrations';
import {
  toIntegration,
  toServerIntegrationRequest,
} from '../types/adapters/IntegrationAdapter';
import {
  Integration,
  NewIntegration,
  UserIntegration,
} from '../types/Integration';
import { useTransformQueryResponse } from '../utils/insights-common-typescript';

export const createIntegrationActionCreator = (integration: NewIntegration) => {
  return Operations.EndpointResource$v1CreateEndpoint.actionCreator({
    body: toServerIntegrationRequest(integration),
  });
};

export const saveIntegrationActionCreator = (
  integration: Integration | NewIntegration | UserIntegration
) => {
  if (integration.id) {
    return Operations.EndpointResource$v1UpdateEndpoint.actionCreator({
      body: toServerIntegrationRequest(integration),
      id: integration.id,
    });
  }

  return createIntegrationActionCreator(integration);
};

const decoder = (
  response:
    | Operations.EndpointResource$v1CreateEndpoint.Payload
    | Operations.EndpointResource$v1UpdateEndpoint.Payload
) => {
  if (response.type === 'Endpoint') {
    return {
      ...response,
      type: 'Integration',
      value: toIntegration(response.value as Schemas.Endpoint),
    };
  }

  return response;
};

export const useSaveIntegrationMutation = () =>
  useTransformQueryResponse(useMutation(saveIntegrationActionCreator), decoder);
