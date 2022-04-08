import { useQuery } from 'react-fetching-library';

import { Operations, Schemas } from '../../generated/OpenapiNotifications';

const getBundlesAction = (includeApplications: boolean) => Operations.NotificationServiceGetBundleFacets.actionCreator(includeApplications);

export const useGetBundles = (includeApplications?: boolean, initFetch = true) =>
    useQuery(getBundlesAction(!!includeApplications), initFetch);

export const useGetBundleByName = () => {
    const { query } = useGetBundles(false, false);  // includeApplications = false, initFetch = false
    return async (bundleName: string)  => {
        const response = await query();
        const payload = response.payload as Operations.NotificationServiceGetApplicationsFacets.Payload;
        if (response.errorObject) {
            throw response.errorObject;
        }

        if (response.error || !payload) {
            throw new Error(`Unable to retrieve bundles, status ${payload.status}`);
        }

        const value = payload.value as Schemas.Bundle[];
        return value.find(bundle => bundle.name === bundleName);
    };
};
