import * as Generated from '../generated/Types';
import IntegrationType = Generated.EndpointType;
export { EndpointType as IntegrationType } from '../generated/Types';

export interface IntegrationBase {
    id: string;
    name: string;
    type: IntegrationType;
    isEnabled: boolean;
}

export interface IntegrationHttp extends IntegrationBase {
    type: IntegrationType.WEBHOOK;
    url: string;
}

export type Integration = IntegrationHttp;

type NewIntegrationKeys = 'id';

export type NewIntegrationTemplate<T extends IntegrationBase> = Omit<T, NewIntegrationKeys> & Partial<Pick<T, NewIntegrationKeys>>;

export type NewIntegrationBase = NewIntegrationTemplate<IntegrationBase>;
export type NewIntegration = NewIntegrationTemplate<Integration>;

export type ServerIntegrationRequest = Generated.Endpoint;
export type ServerIntegrationResponse = Generated.Endpoint;
