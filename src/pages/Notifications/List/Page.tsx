import { AppSkeleton, getInsights } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { defaultBundleName, RedirectToDefaultBundle } from '../../../components/RedirectToDefaultBundle';
import { linkTo } from '../../../Routes';
import { useGetApplicationsLazy } from '../../../services/Notifications/GetApplications';
import { useGetBundles } from '../../../services/Notifications/GetBundles';
import { Facet } from '../../../types/Notification';
import { NotificationListBundlePage } from './BundlePage';

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
    const history = useHistory();
    const insights = getInsights();
    const onFunction = insights?.chrome?.on;

    const getBundles = useGetBundles();
    const getApplications = useGetApplicationsLazy();

    React.useEffect(() => {
        let unregister;
        if (onFunction) {
            unregister = onFunction('APP_NAVIGATION', (event: any) => {
                history.push(linkTo.notifications(event.navId));
            });
        }

        return () => {
            typeof unregister === 'function' && unregister();
        };
    }, [ history, onFunction ]);

    const bundle: Facet | BundleStatus = useMemo(() => {
        if (getBundles.payload?.status === 200) {
            return getBundles.payload.value.find(b => b.name === params.bundleName) ?? BundleStatus.NOT_FOUND;
        } else if (getBundles.payload) {
            return BundleStatus.FAILED_TO_LOAD;
        }

        return BundleStatus.LOADING;
    }, [ getBundles.payload, params.bundleName ]);

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
        if (params.bundleName === defaultBundleName) {
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
            bundle={ bundle }
            applications={ applications }
        />
    );
};
