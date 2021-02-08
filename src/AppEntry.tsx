import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import {
    createFetchingClient,
    getInsights,
    getStore
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

const client = createFetchingClient(getInsights, {
    responseInterceptors: [ validateSchemaResponseInterceptor ]
});

export const AppEntry: React.FunctionComponent<AppEntryProps> = (props) => {

    /* const client = React.useMemo(() => createFetchingClient(getInsights, {
        responseInterceptors: [ validateSchemaResponseInterceptor ]
    }), []);*/

    console.log('Calling useEffect??');

    React.useEffect(() => {
        console.log('Use effect');
        try {
            getStore();
        } catch (e) {
            resetStore();
        }

        if (props.logger) {
            createStore(props.logger);
        } else {
            createStore();
        }

        /*// Todo: No idea why this effect doesn't seem to get called when returning a destructor.
        return () => {
            resetStore();
        };*/
    }, [ props.logger ]);

    /*React.useEffect(() => {
        console.log('Inside useEffect');
        if (props.logger) {
            createStore(props.logger);
        } else {
            createStore();
        }

        console.log('store initialized');
        console.log('store', getStore());

        return () => {

        };

    }, [ props.logger ]);*/

    const language = React.useMemo(() => navigator.language.slice(0, 2), [ navigator ]);

    return (
        <IntlProvider locale={ language } messages={ messages } onError={ console.log }>
            <Provider store={ getStore() }>
                <Router basename={ getBaseName(window.location.pathname) }>
                    <ClientContextProvider client={ client }>
                        <App />
                    </ClientContextProvider>
                </Router>
            </Provider>
        </IntlProvider>
    );
};
