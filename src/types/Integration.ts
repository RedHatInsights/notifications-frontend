import { Schemas } from '../generated/OpenapiIntegrations';

export enum IntegrationType {
    WEBHOOK = 'webhook',
    CAMEL = 'camel',
    EMAIL_SUBSCRIPTION = 'email_subscription'
}

// Integrations that the user can create in the Integrations page
export enum UserIntegrationType {
    WEBHOOK = 'webhook',
    CAMEL = 'camel'
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

export interface IntegrationCamel extends IntegrationBase {
    type: IntegrationType.CAMEL;
    url: string;
    sslVerificationEnabled: boolean;
    secretToken?: string;
    basicAuth?: string; // TODO this is a map { user, pass}
    extras?: string; // TODO this is a freeform map<string,string>
}

export interface IntegrationEmailSubscription extends IntegrationBase {
    type: IntegrationType.EMAIL_SUBSCRIPTION
}

export type Integration = IntegrationHttp | IntegrationEmailSubscription | IntegrationCamel;

type ToUserIntegration<T extends IntegrationBase, TYPE extends UserIntegrationType[keyof UserIntegrationType]> = Omit<T, 'type'> & {
    type: TYPE
};

export type UserIntegration = ToUserIntegration<IntegrationHttp, UserIntegrationType.WEBHOOK>;

type NewIntegrationKeys = 'id';

export type NewIntegrationTemplate<T extends IntegrationBase | UserIntegration> = Omit<T, NewIntegrationKeys> & Partial<Pick<T, NewIntegrationKeys>>;

export type NewIntegrationBase = NewIntegrationTemplate<IntegrationBase>;
export type NewIntegration = NewIntegrationTemplate<Integration>;
export type NewUserIntegration = NewIntegrationTemplate<UserIntegration>;

export type ServerIntegrationRequest = Schemas.Endpoint;
export type ServerIntegrationResponse = Schemas.Endpoint;

export interface IntegrationConnectionAttempt {
    date: Date;
    isSuccess: boolean;
}
