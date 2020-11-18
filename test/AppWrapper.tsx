import * as React from 'react';

import { ClientContextProvider, createClient } from 'react-fetching-library';
import { MemoryRouterProps, useLocation } from 'react-router';
import { Route, RouteProps } from 'react-router';
import { getInsights, initStore, restoreStore } from '@redhat-cloud-services/insights-common-typescript';

import { AppContext } from '../src/app/AppContext';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import messages from '../locales/data.json';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';

import fetchMock = require('fetch-mock');
let setup = false;
let client;
let store;

export const appWrapperSetup = () => {
    if (setup) {
        throw new Error('Looks like appWrapperCleanup has not been called, you need to call it on the afterEach');
    }

    const rootDiv = document.createElement('div');
    rootDiv.id = 'root';
    document.body.appendChild(rootDiv);

    setup = true;
    fetchMock.mock();
    client = createClient({
        responseInterceptors: [
            validateSchemaResponseInterceptor
        ]
    });

    store = initStore().getStore();
};

export const appWrapperCleanup = () => {
    try {
        const calls = fetchMock.calls(false).filter(c => c.isUnmatched || c.isUnmatched === undefined);
        if (calls.length > 0) {
            throw new Error(`Found ${ calls.length } unmatched calls, maybe you forgot to mock? : ${calls.map(c => c.request?.url || c['0'])}`);
        }
    } finally {
        setup = false;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        document.getElementById('root')!.remove();

        fetchMock.restore();
        restoreStore();
    }
};

type Config = {
    router?: MemoryRouterProps;
    route?: RouteProps;
    appContext?: AppContext;
    getLocation?: jest.Mock; // Pass a jest.fn() to get back the location hook
}

const defaultAppContextSettings = {
    rbac: {
        canReadAll: true,
        canWriteAll: true
    }
};

const InternalWrapper: React.FunctionComponent<Config> = (props) => {
    const location = useLocation();

    (getInsights().chrome.isBeta as jest.Mock).mockImplementation(() => {
        return location.pathname.startsWith('/beta/');
    });

    if (props.getLocation) {
        props.getLocation.mockImplementation(() => location);
    }

    return <>{ props.children }</>;
};

export const AppWrapper: React.FunctionComponent<Config> = (props) => {
    if (!setup) {
        throw new Error('appWrapperSetup has not been called, you need to call it on the beforeEach');
    }

    return (
        <IntlProvider locale={ navigator.language } messages={ messages }>
            <Provider store={ store }>
                <Router { ...props.router } >
                    <ClientContextProvider client={ client }>
                        <AppContext.Provider value={ props.appContext || defaultAppContextSettings }>
                            <NotificationsPortal/>
                            <InternalWrapper { ...props }>
                                <Route { ...props.route } >
                                    { props.children }
                                </Route>
                            </InternalWrapper>
                        </AppContext.Provider>
                    </ClientContextProvider>
                </Router>
            </Provider>
        </IntlProvider>
    );
};

export const getConfiguredAppWrapper = (config?: Config) => {
    const ConfiguredAppWrapper: React.FunctionComponent = (props) => {
        return (
            <AppWrapper { ...config }>{ props.children }</AppWrapper>
        );
    };

    return ConfiguredAppWrapper;
};
