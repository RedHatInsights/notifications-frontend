import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
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

  // Get Kessel v2 permissions
  const kesselRbacContext = useKesselRbacAccess();
  const { permissions: kesselPermissions, isLoading: isKesselLoading } = kesselRbacContext;

  // Determine org version using feature flag (v2 if flag enabled, v1 otherwise)
  const isV2Org = useFlag('platform.rbac.workspaces');

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

  // Effect to fetch v1 RBAC when org is v1 (no need to wait for Kessel)
  useEffect(() => {
    if (userLoaded && !isV2Org) {
      fetchRBAC(`${Config.notifications.subAppId},${Config.integrations.subAppId}`).then(setV1Rbac);
    }
  }, [userLoaded, isV2Org]);

  // Compute final RBAC object based on org version
  const rbac = React.useMemo(() => {
    if (isV2Org) {
      // v2 org: map Kessel permissions to v1 structure
      if (isKesselLoading) {
        return undefined; // Still loading v2 permissions
      }
      return mapKesselToV1Permissions(kesselPermissions);
    } else {
      // v1 org: use traditional v1 RBAC
      if (!v1Rbac) {
        return undefined; // Still loading v1 permissions
      }
      return {
        canWriteNotifications: v1Rbac.hasPermission('notifications', 'notifications', 'write'),
        canReadNotifications: v1Rbac.hasPermission('notifications', 'notifications', 'read'),
        canWriteIntegrationsEndpoints: v1Rbac.hasPermission('integrations', 'endpoints', 'write'),
        canReadIntegrationsEndpoints: v1Rbac.hasPermission('integrations', 'endpoints', 'read'),
        canReadEvents: v1Rbac.hasPermission('notifications', 'events', 'read'),
      };
    }
  }, [isV2Org, isKesselLoading, kesselPermissions, v1Rbac]);

  return {
    rbac,
    isOrgAdmin,
    server,
  };
};
