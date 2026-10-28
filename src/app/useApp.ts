import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useEffect, useState } from 'react';
import * as React from 'react';

import Config from '../config/Config';
import { useGetServerStatus } from '../services/GetServerStatus';
import { Server, ServerStatus } from '../types/Server';
import { AppContext } from './AppContext';
import { Rbac, fetchRBAC } from '../utils/insights-common-typescript';
import { useKesselRbacAccess } from './rbac/KesselRbacAccessContext';
import { mapKesselToV1Permissions } from './rbac/utils/permissionMapper';

export const useApp = (): Partial<AppContext> => {
  const chrome = useChrome();
  const serverStatus = useGetServerStatus();
  const [v1Rbac, setV1Rbac] = useState<Rbac>();
  const [server, setServer] = useState<Server>();
  const [isOrgAdmin, setOrgAdmin] = useState<boolean>(false);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);

  // Get org V2 detection and Kessel v2 permissions
  const kesselRbacContext = useKesselRbacAccess();
  const { permissions: kesselPermissions, isLoading: isKesselLoading, isOrgV2 } = kesselRbacContext;

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
        // Auth failed, ensure org admin is false
        setOrgAdmin(false);
      })
      .finally(() => {
        // Always set userLoaded to unblock RBAC fetch
        setUserLoaded(true);
      });
    // Chrome object is changed when the user is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch v1 RBAC only for v1 orgs. All notifications/integrations permissions are
  // fully migrated to Kessel v2, so v2 orgs don't need the v1 endpoint.
  useEffect(() => {
    if (userLoaded && isOrgV2 === false) {
      fetchRBAC(`${Config.notifications.subAppId},${Config.integrations.subAppId}`)
        .then((rbac) => {
          setV1Rbac(rbac);
        })
        .catch(() => {
          setV1Rbac(new Rbac({}));
        });
    }
  }, [userLoaded, isOrgV2]);

  const rbac = React.useMemo(() => {
    if (isOrgV2 === undefined) {
      // Org v1/v2 detection pending
      return undefined;
    }

    if (isOrgV2) {
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
    } else {
      if (!v1Rbac) {
        return undefined;
      }
      return {
        canWriteNotifications: v1Rbac.hasPermission('notifications', 'notifications', 'write'),
        canReadNotifications: v1Rbac.hasPermission('notifications', 'notifications', 'read'),
        canWriteIntegrationsEndpoints: v1Rbac.hasPermission('integrations', 'endpoints', 'write'),
        canReadIntegrationsEndpoints: v1Rbac.hasPermission('integrations', 'endpoints', 'read'),
        canReadEvents: v1Rbac.hasPermission('notifications', 'events', 'read'),
      };
    }
  }, [isOrgV2, isKesselLoading, kesselPermissions, v1Rbac]);

  return {
    rbac,
    isOrgAdmin,
    server,
  };
};
