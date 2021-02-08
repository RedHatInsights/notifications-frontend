import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import {
    createFetchingClient,
    getInsights
} from '@redhat-cloud-services/insights-common-typescript';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Redux from 'redux';

import messages from '../locales/data.json';
import App from './app/App';
import { createStore, resetStore } from './store/Store';
import { getBaseName } from './utils/Basename';

interface AppEntryProps {
    logger?: Redux.Middleware;
}

export const AppEntry: React.FunctionComponent<AppEntryProps> = (props) => {

    const client = React.useMemo(() => createFetchingClient(getInsights, {
        responseInterceptors: [ validateSchemaResponseInterceptor ]
    }), []);

    const store = React.useMemo(() => {
        resetStore();
        if (props.logger) {
            return createStore(props.logger).store;
        } else {
            return createStore().store;
        }

    }, [ props.logger ]);

    return (
        <IntlProvider locale={ navigator.language.slice(0, 2) } messages={ messages } onError={ console.log }>
            <Provider store={ store }>
                <Router basename={ getBaseName(window.location.pathname) }>
                    <ClientContextProvider client={ client }>
                        <App />
                    </ClientContextProvider>
                </Router>
            </Provider>
        </IntlProvider>
    );
};
