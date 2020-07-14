
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
