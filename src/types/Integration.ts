
export enum IntegrationType {
    HTTP = 'http'
}

export interface IntegrationBase {
    id: string;
    name: string;
    type: IntegrationType;
    isEnabled: boolean;
}

export interface IntegrationHttp extends IntegrationBase {
    type: IntegrationType.HTTP;
    url: string;
}

export type Integration = IntegrationHttp;

type NewIntegrationKeys = 'id';

export type NewIntegrationTemplate<T extends IntegrationBase> = Omit<T, NewIntegrationKeys> & Partial<Pick<T, NewIntegrationKeys>>;

export type NewIntegrationBase = NewIntegrationTemplate<IntegrationBase>;
export type NewIntegration = NewIntegrationTemplate<Integration>;
