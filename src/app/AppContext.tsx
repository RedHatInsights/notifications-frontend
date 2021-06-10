import * as React from 'react';
import { useContext } from 'react';

export enum ServerStatus {
    RUNNING= 'RUNNING',
    MAINTENANCE = 'MAINTENANCE'
}

type ServerRunning = {
    status: ServerStatus.RUNNING;
}

type ServerMaintenance = {
    status: ServerStatus.MAINTENANCE;
    from: Date,
    to: Date
}

export type Server = ServerRunning | ServerMaintenance;

export interface AppContext {
    rbac: {
        canWriteIntegrationsEndpoints: boolean;
        canReadIntegrationsEndpoints: boolean;
        canWriteNotifications: boolean;
        canReadNotifications: boolean;
    },
    server: Server
}

export const AppContext = React.createContext<AppContext>({
    rbac: {
        canReadIntegrationsEndpoints: false,
        canReadNotifications: false,
        canWriteIntegrationsEndpoints: false,
        canWriteNotifications: false
    },
    server: {
        status: ServerStatus.RUNNING
    }
});

export const useAppContext = () => useContext(AppContext);
