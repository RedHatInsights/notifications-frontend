import './App.scss';

import { Switch } from '@patternfly/react-core';
import Maintenance from '@redhat-cloud-services/frontend-components/Maintenance';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import format from 'date-fns/format';
import * as React from 'react';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';

import { Routes } from '../Routes';
import { staging } from '../types/Environments';
import { ServerStatus } from '../types/Server';
import { AppContext } from './AppContext';
import { AppSkeleton } from './AppSkeleton';
import { RbacGroupContextProvider } from './rbac/RbacGroupContextProvider';
import { KesselRbacAccessProvider } from './rbac/KesselRbacAccessProvider';
import { useApp } from './useApp';
import { InsightsEnvDetector, RenderIfTrue, toUtc } from '../utils/insights-common-typescript';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';

const utcFormat = 'HH:mm';
const regularFormat = 'hh:mma';
const timezoneFormat = 'O';

/**
 * Inner app component that uses RBAC hooks.
 * Must be rendered inside KesselRbacAccessProvider.
 */
const AppContent: React.FC = () => {
  const chrome = useChrome();

  chrome.updateDocumentTitle?.('Notifications');
  const { rbac, server, isOrgAdmin } = useApp();
  const [usingExperimental, setUsingExperimental] = React.useState<boolean>(false);

  const currentEnvironment = usingExperimental ? 'ci' : chrome.getEnvironment();
  const isBeta = chrome.isBeta();

  const toggleExperimental = React.useCallback(
    (_event: React.FormEvent<HTMLInputElement>, isEnabled: boolean) => {
      setUsingExperimental(isEnabled);
    },
    []
  );

  if (!rbac || !server) {
    return <AppSkeleton />;
  }

  if (server.status === ServerStatus.MAINTENANCE) {
    const utcStartTime = format(toUtc(server.from), utcFormat);
    const utcEndTime = format(toUtc(server.to), utcFormat);
    const startTime = format(server.from, regularFormat);
    const endTime = format(server.to, regularFormat);
    const timezone = format(server.to, timezoneFormat);

    return (
      <Maintenance
        utcStartTime={utcStartTime}
        utcEndTime={utcEndTime}
        startTime={startTime}
        endTime={endTime}
        timeZone={timezone}
      />
    );
  }

  return (
    <AppContext.Provider
      value={{
        rbac,
        server,
        isOrgAdmin: !!isOrgAdmin,
      }}
    >
      <RbacGroupContextProvider>
        <NotificationsProvider>
          <InsightsEnvDetector
            isBeta={isBeta}
            environment={currentEnvironment}
            onEnvironment={staging}
          >
            <RenderIfTrue>
              <Switch
                className="pf-v5-u-p-sm"
                isChecked={usingExperimental}
                onChange={toggleExperimental}
                label="Disable experimental features"
              />
            </RenderIfTrue>
          </InsightsEnvDetector>
          <Routes />
        </NotificationsProvider>
      </RbacGroupContextProvider>
    </AppContext.Provider>
  );
};

/**
 * Main app component — sets up Kessel RBAC provider before rendering app content.
 */
const App: React.ComponentType = () => {
  return (
    <AccessCheck.Provider baseUrl={window.location.origin} apiPath="/api/kessel/v1beta2">
      <KesselRbacAccessProvider>
        <AppContent />
      </KesselRbacAccessProvider>
    </AccessCheck.Provider>
  );
};

export default App;
