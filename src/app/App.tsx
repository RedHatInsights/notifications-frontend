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
import { AppKesselContextBridge } from './AppKesselContextBridge';
import { AppSkeleton } from './AppSkeleton';
import { KesselRbacAccessProvider } from './rbac/KesselRbacAccessProvider';
import { RbacGroupContextProvider } from './rbac/RbacGroupContextProvider';
import { useApp } from './useApp';
import {
  InsightsEnvDetector,
  RenderIfTrue,
  getInsights,
  toUtc,
} from '../utils/insights-common-typescript';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';

const utcFormat = 'HH:mm';
const regularFormat = 'hh:mma';
const timezoneFormat = 'O';

const App: React.ComponentType = () => {
  const { updateDocumentTitle } = useChrome();

  updateDocumentTitle?.('Notifications');
  const { server, isOrgAdmin } = useApp();
  const insights = getInsights();
  const [usingExperimental, setUsingExperimental] =
    React.useState<boolean>(false);

  const toggleExperimental = React.useCallback(
    (isEnabled) => {
      if (isEnabled) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (insights.chrome as any).getEnvironmentOriginal =
          insights.chrome.getEnvironment;
        insights.chrome.getEnvironment = () => 'ci';
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        insights.chrome.getEnvironment = (insights.chrome as any)
          .getEnvironmentOriginal as typeof insights.chrome.getEnvironment;
      }

      setUsingExperimental(isEnabled);
    },
    [insights]
  );

  if (!server) {
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

  const apiBaseUrl =
    typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <AccessCheck.Provider baseUrl={apiBaseUrl} apiPath="/api/kessel/v1beta2">
      <KesselRbacAccessProvider>
        <AppKesselContextBridge server={server} isOrgAdmin={!!isOrgAdmin}>
          <RbacGroupContextProvider>
            <NotificationsProvider>
              <InsightsEnvDetector insights={insights} onEnvironment={staging}>
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
        </AppKesselContextBridge>
      </KesselRbacAccessProvider>
    </AccessCheck.Provider>
  );
};

export default App;
