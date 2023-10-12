import { useFlag } from '@unleash/proxy-client-react';
import * as React from 'react';
import { Navigate, Route, Routes as DomRoutes } from 'react-router-dom';

import { CheckReadPermissions } from './components/CheckReadPermissions';
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
    integrations: () => '/integrations',
    notifications: (bundle: string) => `/${bundle}`,
    eventLog: (bundle?: string) => `/eventlog${bundle ? `?bundle=${bundle}` : ''}`,
    splunk: () => '/integrations/splunk-setup'
};

const EmptyPage: React.FunctionComponent = () => null;

const legacyRoutes: Path[] = [
    {
        path: '/',
        component: EmptyPage
    },
    {
        path: linkTo.integrations(),
        component: IntegrationsListPage
    },
    {
        path: linkTo.eventLog(),
        component: EventLogPage
    },
    {
        path: linkTo.notifications(':bundleName'),
        component: NotificationsListPage
    },
    {
        path: linkTo.splunk(),
        component: SplunkSetupPage
    }
];

const routesOverhaul: Path[] = [
    {
        path: linkTo.overview(),
        component: NotificationsOverviewPage
    },
    {
        path: linkTo.integrations(),
        component: IntegrationsListPage
    },
    {
        path: linkTo.configureEvents(),
        component: NotificationsListPage
    },
    {
        path: linkTo.eventLog(),
        component: EventLogPage
    }
];

export const Routes: React.FunctionComponent = () => {
    const notificationsOverhaul = useFlag('platform.notifications.overhaul');

    const pathRoutes = React.useMemo(() => notificationsOverhaul ? routesOverhaul : legacyRoutes, [ notificationsOverhaul ]);

    return (
        <DomRoutes>
            { pathRoutes.map(pathRoute => (
                <Route key={ pathRoute.path } path={ pathRoute.path } element={ <CheckReadPermissions>
                    <pathRoute.component />
                </CheckReadPermissions> } />
            ))}
            {!notificationsOverhaul && <Route
                path="*"
                element={ <Navigate to="/" replace /> }
            />}
        </DomRoutes>
    );
};
