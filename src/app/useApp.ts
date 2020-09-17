import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { waitForInsights, Rbac, fetchRBAC } from '@redhat-cloud-services/insights-common-typescript';
import Config from '../config/Config';
import { AppContext } from './AppContext';

export const useApp = (): Omit<AppContext, 'rbac'> & Partial<Pick<AppContext, 'rbac'>> => {

    const history = useHistory();
    const [ rbac, setRbac ] = useState<Rbac | undefined>(undefined);

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
        rbac
    };
};
