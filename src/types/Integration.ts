import { Schemas } from '../generated/OpenapiIntegrations';

export enum IntegrationType {
    WEBHOOK = 'webhook'
}

export interface IntegrationBase {
    id: string;
    name: string;
    type: IntegrationType;
    isEnabled: boolean;
}

export interface IntegrationHttp extends IntegrationBase {
    type: IntegrationType.WEBHOOK;
    url: string;
    sslVerificationEnabled: boolean;
    secretToken?: string;
    method: Schemas.HttpType;
}

export type Integration = IntegrationHttp;

type NewIntegrationKeys = 'id';

export type NewIntegrationTemplate<T extends IntegrationBase> = Omit<T, NewIntegrationKeys> & Partial<Pick<T, NewIntegrationKeys>>;

export type NewIntegrationBase = NewIntegrationTemplate<IntegrationBase>;
export type NewIntegration = NewIntegrationTemplate<Integration>;

export type ServerIntegrationRequest = Schemas.Endpoint;
export type ServerIntegrationResponse = Schemas.Endpoint;

export interface IntegrationConnectionAttempt {
    date: Date;
    isSuccess: boolean;
}
