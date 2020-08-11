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
            const appId = (insights.chrome as any).getApp();
            switch (appId) {
                case Config.notifications.appId:
                    document.title = Config.notifications.title;
                    break;
                case Config.integrations.appId:
                    document.title = Config.integrations.title;
                    break;
            }

            insights.chrome.identifyApp(appId);
        });
    }, [ history ]);

    useEffect(() => {
        waitForInsights().then(insights => {
            insights.chrome.auth.getUser().then(() => {
                // Todo: Change to insights.chrome.getApp()
                fetchRBAC('policies').then(setRbac);
            });
        });
    }, []);

    return {
        rbac
    };
};
