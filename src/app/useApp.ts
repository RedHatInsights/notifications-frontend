import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useEffect, useState } from 'react';

import Config from '../config/Config';
import { useGetServerStatus } from '../services/GetServerStatus';
import { Server, ServerStatus } from '../types/Server';
import { AppContext } from './AppContext';
import { Rbac, fetchRBAC } from '../utils/insights-common-typescript';

export const useApp = (): Partial<AppContext> => {
  const chrome = useChrome();
  const serverStatus = useGetServerStatus();
  const [rbac, setRbac] = useState<Rbac>();
  const [server, setServer] = useState<Server>();
  const [isOrgAdmin, setOrgAdmin] = useState<boolean>(false);

  useEffect(() => {
    const appId = chrome.getApp();
    switch (appId) {
      case Config.notifications.subAppId:
        document.title = Config.notifications.title;
        break;
      case Config.integrations.subAppId:
        document.title = Config.integrations.title;
        break;
    }
    // Chrome object is changed when the user is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (serverStatus.payload?.type === 'Events') {
      if (serverStatus.payload?.status === 200) {
        setServer({
          status: ServerStatus.RUNNING,
        });
      } else {
        setServer({
          status: ServerStatus.MAINTENANCE,
          from: new Date(),
          to: new Date(),
        });
      }
    }
  }, [serverStatus.payload]);

  useEffect(() => {
    chrome.auth.getUser().then((user) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setOrgAdmin((user as any).identity.user.is_org_admin);
      fetchRBAC(
        `${Config.notifications.subAppId},${Config.integrations.subAppId}`
      ).then(setRbac);
    });
    // Chrome object is changed when the user is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    rbac: rbac
      ? {
          canWriteNotifications: rbac.hasPermission(
            'notifications',
            'notifications',
            'write'
          ),
          canReadNotifications: rbac.hasPermission(
            'notifications',
            'notifications',
            'read'
          ),
          canWriteIntegrationsEndpoints: rbac.hasPermission(
            'integrations',
            'endpoints',
            'write'
          ),
          canReadIntegrationsEndpoints: rbac.hasPermission(
            'integrations',
            'endpoints',
            'read'
          ),
          canReadEvents: rbac.hasPermission('notifications', 'events', 'read'),
        }
      : undefined,
    isOrgAdmin,
    server,
  };
};
