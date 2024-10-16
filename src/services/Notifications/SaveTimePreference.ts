import { useMutation } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';

export type SaveTimePrefActionsParams = {
  body: string;
};

const actionCreator = (params: SaveTimePrefActionsParams) => {
  return Operations.OrgConfigResourceSaveDailyDigestTimePreference.actionCreator(
    {
      body: params.body,
    }
  );
};

export const useUpdateTimePreference = () => {
  return useMutation(actionCreator);
};
