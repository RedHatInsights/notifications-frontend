import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
    initStore,
    createFetchingClient,
    getStore,
    getInsights
} from '@redhat-cloud-services/insights-common-typescript';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import App from './app/App';
import logger from 'redux-logger';
import { ClientContextProvider } from 'react-fetching-library';
import { getBaseName } from './utils/Basename';

const client = createFetchingClient(getInsights, {
    responseInterceptors: [ validateSchemaResponseInterceptor ]
});
initStore(logger);

ReactDOM.render(
    <Provider store={ getStore() }>
        <Router basename={ getBaseName(window.location.pathname) }>
            <ClientContextProvider client={ client }>
                <App/>
            </ClientContextProvider>
        </Router>
    </Provider>,

    document.getElementById('root')
);
