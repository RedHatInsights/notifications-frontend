import { useMutation } from 'react-fetching-library';

import { Operations } from '../../generated/OpenapiNotifications';

const actionCreator = () => {
    return Operations.OrgConfigResourceGetDailyDigestTimePreference.actionCreator();
};

export const useGetTimePreference = () => {
    return useMutation(actionCreator);
};
