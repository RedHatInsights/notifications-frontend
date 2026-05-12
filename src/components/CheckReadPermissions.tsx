import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../app/AppContext';
import { useKesselRbacAccess } from '../app/rbac/KesselRbacAccessContext';
import Config from '../config/Config';
import { linkTo } from '../Routes';
import { NotAuthorizedPage } from './NotAuthorized';

export const CheckReadPermissions: React.FunctionComponent<React.PropsWithChildren> = (props) => {
  const chrome = useChrome();
  const { rbac } = useAppContext();
  const location = useLocation();

  // Get Kessel context for v2 org detection
  const { workspaceId, permissions: kesselPermissions } = useKesselRbacAccess();
  const isV2Org = workspaceId !== undefined;

  const hasReadPermissions = React.useMemo(() => {
    const appId = chrome.getApp();

    // v2 org: use Kessel permissions directly
    if (isV2Org) {
      switch (appId) {
        case Config.integrations.subAppId:
          return kesselPermissions.canViewIntegrationsEndpoints;
        case Config.notifications.subAppId:
          if (location.pathname === linkTo.eventLog()) {
            return kesselPermissions.canViewNotificationsEvents;
          }
          return kesselPermissions.canViewNotifications;
      }
      return false;
    }

    // v1 org: use AppContext (populated from v1 API)
    switch (appId) {
      case Config.integrations.subAppId:
        return rbac?.canReadIntegrationsEndpoints;
      case Config.notifications.subAppId:
        if (location.pathname === linkTo.eventLog()) {
          return rbac?.canReadEvents;
        }
        return rbac?.canReadNotifications;
    }

    return false;
  }, [rbac, kesselPermissions, isV2Org, location, chrome]);

  return <>{!hasReadPermissions ? <NotAuthorizedPage /> : props.children}</>;
};
