import * as React from 'react';
import { RouteProps, Route, Switch } from 'react-router';

import { ErrorPage } from './pages/Error/Page';
import { IntegrationsListPage } from './pages/Integrations/List/Page';
import { NotificationsListPage } from './pages/Notifications/List/Page';

interface Path {
    path: string;
    component: React.ComponentType;
    rootClass: string;
}

export const linkTo = {
    integrations: () => '/integrations',
    addIntegration: () => '/integrations/add',
    notifications: () => '/notifications'
};

const pathRoutes: Path[] = [
    {
        path: linkTo.integrations(),
        component: IntegrationsListPage,
        rootClass: 'integrations'
    },
    {
        path: linkTo.notifications(),
        component: NotificationsListPage,
        rootClass: 'notifications'
    }
];

type InsightsRouteProps = {
    rootClass: string;
} & RouteProps;

const InsightsRoute: React.FunctionComponent<InsightsRouteProps> = (props: InsightsRouteProps) => {
    const { rootClass, ...rest } = props;
    const root = document.getElementById(('root'));
    if (!root) {
        throw new Error('Root element not found');
    }

    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return (
        <ErrorPage>
            <Route { ...rest }/>
        </ErrorPage>
    );
};

export const Routes: React.FunctionComponent = () => {
    return (
        <Switch>
            { pathRoutes.map(pathRoute => (
                <InsightsRoute
                    key={ pathRoute.path }
                    rootClass={ pathRoute.rootClass }
                    component={ pathRoute.component }
                    path={ pathRoute.path }
                    exact={ true }
                />
            ))}
        </Switch>
    );
};
