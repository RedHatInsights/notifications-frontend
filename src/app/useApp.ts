import { fetchRBAC, Rbac, waitForInsights } from '@redhat-cloud-services/insights-common-typescript';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Config from '../config/Config';
import { useGetApplications } from '../services/Notifications/GetApplications';
import { AppContext } from './AppContext';

export const useApp = (): Omit<AppContext, 'rbac' | 'applications'> & Partial<Pick<AppContext, 'rbac' | 'applications'>> => {

    const history = useHistory();
    const [ rbac, setRbac ] = useState<Rbac | undefined>(undefined);
    const getApplications = useGetApplications();

    const applications = useMemo(
        () => getApplications.payload?.status === 200 ? getApplications.payload.value : undefined,
        [ getApplications.payload ]
    );

    useEffect(() => {
        waitForInsights().then((insights) => {
            insights.chrome.init();
            const appId = insights.chrome.getApp();
            switch (appId) {
                case Config.notifications.subAppId:
                    document.title = Config.notifications.title;
                    break;
                case Config.integrations.subAppId:
                    document.title = Config.integrations.title;
                    break;
            }

            insights.chrome.identifyApp(appId);
        });
    }, [ history ]);

    useEffect(() => {
        waitForInsights().then(insights => {
            insights.chrome.auth.getUser().then(() => {
                fetchRBAC(Config.appId).then(setRbac);
            });
        });
    }, []);

    return {
        rbac,
        applications
    };
};
