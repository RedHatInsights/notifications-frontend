export enum ServerStatus {
    RUNNING = 'RUNNING',
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
