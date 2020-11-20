import {
    createFetchingClient,
    getInsights,
    getStore,
    initStore
} from '@redhat-cloud-services/insights-common-typescript';

import App from './app/App';
import { ClientContextProvider } from 'react-fetching-library';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { getBaseName } from './utils/Basename';
import messages from '../locales/data.json';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';

const client = createFetchingClient(getInsights, {
    responseInterceptors: [ validateSchemaResponseInterceptor ]
});
initStore();

ReactDOM.render(
    <IntlProvider locale={ navigator.language.slice(0, 2) } messages={ messages } onError={ console.log }>
        <Provider store={ getStore() }>
            <Router basename={ getBaseName(window.location.pathname) }>
                <ClientContextProvider client={ client }>
                    <App />
                </ClientContextProvider>
            </Router>
        </Provider>
    </IntlProvider>,

    document.getElementById('root')
);
