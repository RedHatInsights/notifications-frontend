import { Schemas } from '../generated/OpenapiIntegrations';

// Integrations that exist
export enum IntegrationType {
    WEBHOOK = 'webhook',
    CAMEL = 'camel',
    EMAIL_SUBSCRIPTION = 'email_subscription'
}

export const UserIntegrationType = {
    WEBHOOK: IntegrationType.WEBHOOK,
    CAMEL: IntegrationType.CAMEL
} as const;

export type UserIntegrationType = (typeof UserIntegrationType)[keyof typeof UserIntegrationType];

export interface IntegrationBase<T extends IntegrationType> {
    id: string;
    name: string;
    type: T;
    isEnabled: boolean;
}

export interface IntegrationHttp extends IntegrationBase<IntegrationType.WEBHOOK> {
    type: IntegrationType.WEBHOOK;
    url: string;
    sslVerificationEnabled: boolean;
    secretToken?: string;
    method: Schemas.HttpType;
}

export interface IntegrationCamel extends IntegrationBase<IntegrationType.CAMEL> {
    type: IntegrationType.CAMEL;
    url: string;
    sslVerificationEnabled: boolean;
    secretToken?: string;
    subType?: string;
    basicAuth?: {
        user: string;
        pass: string;
    };
    extras?: Record<string, string>;
}

export interface IntegrationEmailSubscription extends IntegrationBase<IntegrationType.EMAIL_SUBSCRIPTION> {
    type: IntegrationType.EMAIL_SUBSCRIPTION
}

export type Integration = IntegrationHttp | IntegrationEmailSubscription | IntegrationCamel;

// Integrations that the user can create in the Integrations page;
export type UserIntegration = Extract<Integration, {
    type: UserIntegrationType
}>;

type NewIntegrationKeys = 'id';

export type NewIntegrationTemplate<
    T extends IntegrationBase<IntegrationType>
> = Omit<T, NewIntegrationKeys> & Partial<Pick<T, NewIntegrationKeys>>;

export type NewIntegrationBase = NewIntegrationTemplate<IntegrationBase<UserIntegrationType>>;
export type NewIntegration = NewIntegrationTemplate<Integration>;
export type NewUserIntegration = NewIntegrationTemplate<UserIntegration>;

export type ServerIntegrationRequest = Schemas.Endpoint;
export type ServerIntegrationResponse = Schemas.Endpoint;

export interface IntegrationConnectionAttempt {
    date: Date;
    isSuccess: boolean;
}
