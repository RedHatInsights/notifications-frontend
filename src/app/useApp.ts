import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useEffect, useState } from 'react';
import * as React from 'react';

import Config from '../config/Config';
import { useGetServerStatus } from '../services/GetServerStatus';
import { Server, ServerStatus } from '../types/Server';
import { AppContext } from './AppContext';
import { useKesselRbacAccess } from './rbac/KesselRbacAccessContext';
import { mapKesselToV1Permissions } from './rbac/utils/permissionMapper';

export const useApp = (): Partial<AppContext> => {
  const chrome = useChrome();
  const serverStatus = useGetServerStatus();
  const [server, setServer] = useState<Server>();
  const [isOrgAdmin, setOrgAdmin] = useState<boolean>(false);

  const { permissions: kesselPermissions, isLoading: isKesselLoading } = useKesselRbacAccess();

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
    } else if (serverStatus.error) {
      setServer({ status: ServerStatus.RUNNING });
    }
  }, [serverStatus.payload, serverStatus.error]);

  // Effect to fetch user info
  useEffect(() => {
    chrome.auth
      .getUser()
      .then((user) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOrgAdmin((user as any).identity.user.is_org_admin);
      })
      .catch(() => {
        setOrgAdmin(false);
      });
    // Chrome object is changed when the user is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rbac = React.useMemo(() => {
    if (isKesselLoading) {
      return undefined;
    }

    const kesselPerms = mapKesselToV1Permissions(kesselPermissions);

    return {
      canWriteIntegrationsEndpoints: kesselPerms.canWriteIntegrationsEndpoints,
      canReadIntegrationsEndpoints: kesselPerms.canReadIntegrationsEndpoints,
      canWriteNotifications: kesselPerms.canWriteNotifications,
      canReadNotifications: kesselPerms.canReadNotifications,
      canReadEvents: kesselPerms.canReadEvents,
    };
  }, [isKesselLoading, kesselPermissions]);

  return {
    rbac,
    isOrgAdmin,
    server,
  };
};
