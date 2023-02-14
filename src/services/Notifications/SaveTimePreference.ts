import { useMutation } from 'react-fetching-library';

import { Operations, Schemas } from '../../generated/OpenapiNotifications';

type SaveTimePrefActionsParams = {
    body: Schemas.LocalTime;
}

const updateTimePrefActionCreator = (params: SaveTimePrefActionsParams) => {
    return Operations.OrgConfigResourceSaveDailyDigestTimePreference.actionCreator({
        body: params.body
    });
};

export const useUpdateTimePreference = () => useMutation(updateTimePrefActionCreator);
