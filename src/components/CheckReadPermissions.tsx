import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../app/AppContext';
import Config from '../config/Config';
import { linkTo } from '../Routes';
import { NotAuthorizedPage } from './NotAuthorized';

export const CheckReadPermissions: React.FunctionComponent<React.PropsWithChildren> = (props) => {
  const chrome = useChrome();
  const { rbac } = useAppContext();
  const location = useLocation();

  const hasReadPermissions = React.useMemo(() => {
    const appId = chrome.getApp();

    // AppContext.rbac is already correctly populated by useApp for both v1 and v2 orgs
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
  }, [rbac, location, chrome]);

  return <>{!hasReadPermissions ? <NotAuthorizedPage /> : props.children}</>;
};
