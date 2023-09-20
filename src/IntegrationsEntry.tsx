import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import {
    createFetchingClient,
    getInsights
} from '@redhat-cloud-services/insights-common-typescript';
import { enableMapSet } from 'immer';
import { validateSchemaResponseInterceptor } from 'openapi2typescript/react-fetching-library';
import React from 'react';
import { ClientContextProvider } from 'react-fetching-library';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import messages from '../locales/data.json';
import IntegrationsApp from './app/IntegrationsApp';
import { AppEntryProps } from './AppEntry';
import { getNotificationsRegistry } from './store/Store';
import { getBaseName } from './utils/Basename';

enableMapSet();

const IntegrationsEntry: React.FunctionComponent<AppEntryProps> = (props) => {

    const client = React.useMemo(() => createFetchingClient(getInsights, {
        responseInterceptors: [ validateSchemaResponseInterceptor ]
    }), []);

    const store = React.useMemo(() => {
        const registry = props.logger ? getNotificationsRegistry(props.logger) : getNotificationsRegistry();
        return registry.getStore();
    }, [ props.logger ]);

    return (
        <IntlProvider locale={ navigator.language.slice(0, 2) } messages={ messages } onError={ console.log }>
            <Provider store={ store }>
                <Router basename={ getBaseName(window.location.pathname) }>
                    <ClientContextProvider client={ client }>
                        <IntegrationsApp />
                    </ClientContextProvider>
                </Router>
            </Provider>
        </IntlProvider>
    );
};

export default IntegrationsEntry;
