import * as React from 'react';
import { Route, RouteProps, Switch } from 'react-router';

import { RedirectToDefaultBundle } from './components/RedirectToDefaultBundle';
import { ErrorPage } from './pages/Error/Page';
import { IntegrationsListPage } from './pages/Integrations/List/Page';
import { NotificationsListPage } from './pages/Notifications/List/Page';

interface Path {
    path: string;
    component: React.ComponentType;
}

export const linkTo = {
    integrations: () => '/integrations',
    notifications: (bundle: string) => `/notifications/${bundle}`
};

const EmptyPage: React.FunctionComponent = () => null;

const pathRoutes: Path[] = [
    {
        path: '/',
        component: EmptyPage
    },
    {
        path: linkTo.integrations(),
        component: IntegrationsListPage
    },
    {
        path: linkTo.notifications(':bundleName'),
        component: NotificationsListPage
    }
];

type InsightsRouteProps = RouteProps;

const InsightsRoute: React.FunctionComponent<InsightsRouteProps> = (props: InsightsRouteProps) => {
    return (
        <ErrorPage>
            <Route { ...props } />
        </ErrorPage>
    );
};

export const Routes: React.FunctionComponent = () => {
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
