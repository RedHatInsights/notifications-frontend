import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
import * as React from 'react';
import { Routes as DomRoutes, Navigate, Route, useNavigate } from 'react-router-dom';

const NotificationsLogRedirect: React.FunctionComponent = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/settings/notifications/eventlog', { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
};

import { IntegrationsListPage } from './pages/Integrations/List/Page';
import { SplunkSetupPage } from './pages/Integrations/SplunkSetup/SplunkSetupPage';
import { EventLogPage } from './pages/Notifications/EventLog/EventLogPage';
import { NotificationsListPage } from './pages/Notifications/List/Page';
import { NotificationsOverviewPage } from './pages/Notifications/Overview/Page';

interface Path {
  path: string;
  component: React.ComponentType;
}

export const linkTo = {
  overview: () => '/',
  configureEvents: () => '/configure-events',
  integrations: () => '/settings/integrations',
  notifications: (bundle: string) => `/${bundle}`,
  eventLog: (bundle?: string) => `/eventlog${bundle ? `?bundle=${bundle}` : ''}`,
  notificationsLog: () => '/notificationslog',
  splunk: () => '/integrations/splunk-setup',
};

const EmptyPage: React.FunctionComponent = () => {
  const { getApp } = useChrome();
  if (getApp() === 'integrations') {
    return <IntegrationsListPage />;
  }

  return null;
};

const legacyRoutes: Path[] = [
  {
    path: '/',
    component: EmptyPage,
  },
  {
    path: linkTo.integrations(),
    component: IntegrationsListPage,
  },
  {
    path: linkTo.eventLog(),
    component: EventLogPage,
  },
  {
    path: linkTo.notifications(':bundleName'),
    component: NotificationsListPage,
  },
  {
    path: linkTo.splunk(),
    component: SplunkSetupPage,
  },
];

const routesOverhaul: Path[] = [
  {
    path: linkTo.overview(),
    component: NotificationsOverviewPage,
  },
  {
    path: linkTo.integrations(),
    component: IntegrationsListPage,
  },
  {
    path: linkTo.configureEvents(),
    component: NotificationsListPage,
  },
  {
    path: linkTo.eventLog(),
    component: EventLogPage,
  },
];

export const Routes: React.FunctionComponent = () => {
  const notificationsOverhaul = useFlag('platform.notifications.overhaul');
  const { getApp } = useChrome();

  const pathRoutes = React.useMemo(
    () => (notificationsOverhaul ? routesOverhaul : legacyRoutes),
    [notificationsOverhaul]
  );

  // FIXUP: notifications overhaul removed splunk setup page, but customers require it
  if (notificationsOverhaul && getApp() === 'integrations') {
    pathRoutes.unshift({
      path: '/',
      component: SplunkSetupPage,
    });
  }

  return (
    <DomRoutes>
      <Route path={linkTo.notificationsLog()} element={<NotificationsLogRedirect />} />
      {pathRoutes.map((pathRoute) => (
        <Route key={pathRoute.path} path={pathRoute.path} element={<pathRoute.component />} />
      ))}
      <Route path="*" element={<Navigate to="/settings/notifications" replace />} />
    </DomRoutes>
  );
};
