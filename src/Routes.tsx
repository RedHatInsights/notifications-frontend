import { getInsights } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useEffect } from 'react';
import { matchPath, Route, RouteProps, Switch, useHistory } from 'react-router';

import { CheckReadPermissions } from './components/CheckReadPermissions';
import { RedirectToDefaultBundle } from './components/RedirectToDefaultBundle';
import { ErrorPage } from './pages/Error/Page';
import { ConnectedIntegrationsListPage } from './pages/Integrations/List/Page';
import { EventLogPage } from './pages/Notifications/EventLog/EventLogPage';
import { NotificationsListPage } from './pages/Notifications/List/Page';
import { getBaseName } from './utils/Basename';

interface Path {
    path: string;
    component: React.ComponentType;
}

export const linkTo = {
    integrations: () => '/integrations',
    notifications: (bundle: string) => `/notifications/${bundle}`,
    eventLog: (bundle?: string) => `/notifications/eventlog${bundle ? `?bundle=${bundle}` : ''}`
};

const EmptyPage: React.FunctionComponent = () => null;

const pathRoutes: Path[] = [
    {
        path: '/',
        component: EmptyPage
    },
    {
        path: linkTo.integrations(),
        component: ConnectedIntegrationsListPage
    },
    {
        path: linkTo.eventLog(),
        component: EventLogPage
    },
    {
        path: linkTo.notifications(':bundleName'),
        component: NotificationsListPage
    }
];

type InsightsRouteProps = Omit<RouteProps, 'component'> & Pick<Path, 'component'>;

const InsightsRoute: React.FunctionComponent<InsightsRouteProps> = (props: InsightsRouteProps) => {
    const { component, ...restProps } = props;
    return (
        <ErrorPage>
            <Route { ...restProps }>
                <CheckReadPermissions>
                    <props.component />
                </CheckReadPermissions>
            </Route>
        </ErrorPage>
    );
};

export const Routes: React.FunctionComponent = () => {
    const insights = getInsights();
    const history = useHistory();

    useEffect(() => {
        const on = insights.chrome.on;
        if (on) {
            return on('APP_NAVIGATION', event => {
                const pathname = event.domEvent.href;
                const base = getBaseName(pathname);
                const relative = pathname.substr(base.length);

                for (const route of pathRoutes) {
                    if (matchPath(relative, {
                        path: route.path,
                        exact: true
                    })) {
                        if (history.location.pathname !== relative) {
                            history.replace(relative);
                        }

                        break;
                    }
                }

            });
        }
    }, [ insights.chrome.on, history ]);

    return (
        <Switch>
            { pathRoutes.map(pathRoute => (
                <InsightsRoute
                    key={ pathRoute.path }
                    component={ pathRoute.component }
                    path={ pathRoute.path }
                    exact={ true }
                />
            ))}
            <RedirectToDefaultBundle />
        </Switch>
    );
};
