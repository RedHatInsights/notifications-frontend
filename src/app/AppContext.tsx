import * as React from 'react';
import { Rbac } from '@redhat-cloud-services/insights-common-typescript';

export interface AppContext {
    rbac: Rbac;
}

export const AppContext = React.createContext<AppContext>({
    rbac: {
        canReadAll: false,
        canWriteAll: false
    }
});
