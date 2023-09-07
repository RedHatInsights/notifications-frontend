import { useFlag } from '@unleash/proxy-client-react';
import _ from 'lodash';
import * as React from 'react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { AppSkeleton } from '../../../app/AppSkeleton';
import { defaultBundleName, RedirectToDefaultBundle } from '../../../components/RedirectToDefaultBundle';
import { useGetApplicationsLazy } from '../../../services/Notifications/GetApplications';
import { useGetBundles, useGetBundleByName } from '../../../services/Notifications/GetBundles';
import { Facet } from '../../../types/Notification';
import { NotificationListBundlePage } from './BundlePage';

interface BundleData {
    bundle: Facet;
    applications: Facet[];
}

interface NotificationListPageParams {
    bundleName: string;
}

enum BundleStatus {
    LOADING,
    NOT_FOUND,
    FAILED_TO_LOAD
}

const isBundleStatus = (bundle: Facet | BundleStatus): bundle is BundleStatus => typeof bundle === 'number';

export const NotificationsListPage: React.FunctionComponent = () => {
    const params = useParams<NotificationListPageParams>();
    const notificationsOverhaul = useFlag('platform.notifications.overhaul');
    const bundleList = ['rhel', 'console', 'openshift'];

    const bundleName = useMemo(() => notificationsOverhaul ? defaultBundleName : params.bundleName, [ notificationsOverhaul, params.bundleName ]);

    const getBundles = useGetBundles();
    const getApplications = useGetApplicationsLazy();

    const bundle: Facet | BundleStatus = useMemo(() => {
        if (getBundles.payload?.status === 200) {
            return getBundles.payload.value.find(b => b.name === bundleName) ?? BundleStatus.NOT_FOUND;
        } else if (getBundles.payload) {
            return BundleStatus.FAILED_TO_LOAD;
        }

        return BundleStatus.LOADING;
    }, [ getBundles.payload, bundleName ]);

    const bundleTabs: Facet[] | BundleStatus = [];

    const getbundleTabs = () => {
        if (getBundles.payload?.status === 200) {
            bundleList.forEach(bundle => {
                if(getBundles.payload?.value) {
                    bundleTabs.push((getBundles.payload.value as any).find(b => b.name === bundle) ?? BundleStatus.NOT_FOUND);
                }
            })
        } else if (getBundles.payload) {
            throw new Error('Unable to load bundle information');
        } else {
            return (
                <AppSkeleton />
            );
        }
    }


    if(notificationsOverhaul) {
        getbundleTabs();
    }

    React.useEffect(() => {
        const query = getApplications.query;
        if (!isBundleStatus(bundle)) {
            query(bundle.name);
        }
    }, [ bundle, getApplications.query ]);

    const applications: Array<Facet> | null | undefined = useMemo(
        () => {
            if (getApplications.payload) {
                return getApplications.payload.status === 200 ? getApplications.payload.value : null;
            }

            return undefined;
        },
        [ getApplications.payload ]
    );

    if (bundle === BundleStatus.NOT_FOUND) {
        if (bundleName === defaultBundleName) {
            throw new Error('Default bundle information not found');
        }

        return <RedirectToDefaultBundle />;
    }

    if (bundle === BundleStatus.FAILED_TO_LOAD) {
        throw new Error('Unable to load bundle information');
    }

    if (applications === null) {
        throw new Error('Unable to load application facets');
    }

    if (bundle === BundleStatus.LOADING || !applications) {
        return (
            <AppSkeleton />
        );
    }

    return (
        <NotificationListBundlePage
            bundleTabs={ bundleTabs }
            bundle={ bundle }
            applications={ applications }
        />
    );
};
