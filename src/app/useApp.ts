import { fetchRBAC, Rbac, waitForInsights } from '@redhat-cloud-services/insights-common-typescript';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Config from '../config/Config';
import { AppContext } from './AppContext';
import { Server } from '../types/Server';
import { useGetServerStatus } from '../services/GetServerStatus';

export const useApp = (): Partial<AppContext> => {

    const history = useHistory();
    const serverStatus = useGetServerStatus();
    const [ rbac, setRbac ] = useState<Rbac>();
    const [ server, setServer ] = useState<Server>();

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
        if (serverStatus.payload?.type === 'ServerStatus') {
            setServer(serverStatus.payload.value);
        }
    }, [ serverStatus.payload ]);

    useEffect(() => {
        waitForInsights().then(insights => {
            insights.chrome.auth.getUser().then(() => {
                fetchRBAC(`${Config.notifications.subAppId},${Config.integrations.subAppId}`).then(setRbac);
            });
        });
    }, []);

    return {
        rbac: rbac ? {
            canWriteNotifications: rbac.hasPermission('notifications', 'notifications', 'write'),
            canReadNotifications: rbac.hasPermission('notifications', 'notifications', 'read'),
            canWriteIntegrationsEndpoints: rbac.hasPermission('integrations', 'endpoints', 'write'),
            canReadIntegrationsEndpoints: rbac.hasPermission('integrations', 'endpoints', 'read')
        } : undefined,
        server
    };
};
