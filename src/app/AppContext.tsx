import * as React from 'react';
import { Rbac } from '@redhat-cloud-services/insights-common-typescript';
import { Schemas } from '../generated/OpenapiIntegrations';
import { useContext } from 'react';

export interface AppContext {
    rbac: Rbac;
    applications: Array<Schemas.ApplicationFacet>
}

export const AppContext = React.createContext<AppContext>({
    rbac: {
        canReadAll: false,
        canWriteAll: false
    },
    applications: []
});

export const useAppContext = () => useContext(AppContext);
