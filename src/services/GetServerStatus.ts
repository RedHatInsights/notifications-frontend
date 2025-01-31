import { useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import {
  validatedResponse,
  validationResponseTransformer,
} from 'openapi2typescript';
import { useQuery } from 'react-fetching-library';

import { Operations } from '../generated/OpenapiRbac';
import { toServer } from '../types/adapters/ServerAdapter';

const adapter = validationResponseTransformer(
  (payload: Operations.GetStatus.Payload) => {
    if (payload.status === 200) {
      return validatedResponse('ServerStatus', 200, toServer(), payload.errors);
    }

    return payload;
  }
);

export const useGetServerStatus = () => {
  return useTransformQueryResponse(
    useQuery(Operations.GetStatus.actionCreator()),
    adapter
  );
};
