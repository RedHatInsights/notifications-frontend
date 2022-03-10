import { Schemas } from '../generated/OpenapiIntegrations';
import { UUID } from './Notification';

// Integrations that exist
// Value should always be type:sub_type or only type if doesn't use sub_types
export enum IntegrationType {
    WEBHOOK = 'webhook',
    EMAIL_SUBSCRIPTION = 'email_subscription',
    SPLUNK = 'camel:splunk',
    SLACK = 'camel:slack'
}

export const UserIntegrationType = {
    WEBHOOK: IntegrationType.WEBHOOK,
    SPLUNK: IntegrationType.SPLUNK,
    SLACK: IntegrationType.SLACK
} as const;

export type Subtypes<U, S extends string> = U extends `${S}:${string}` ? U : never;
export type CamelIntegrationType = Subtypes<IntegrationType, 'camel'>;

export const isCamelType = (type?: IntegrationType): type is CamelIntegrationType => !!type && type.startsWith('camel:');
export const isCamelIntegrationType = (integration: Partial<Integration>): integration is IntegrationCamel =>
    !!integration.type && isCamelType(integration.type);

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

export interface IntegrationCamel extends IntegrationBase<CamelIntegrationType> {
    type: CamelIntegrationType;
    url: string;
    sslVerificationEnabled: boolean;
    secretToken?: string;
    basicAuth?: {
        user: string;
        pass: string;
    };
    extras?: Record<string, string>;
}

export interface IntegrationEmailSubscription extends IntegrationBase<IntegrationType.EMAIL_SUBSCRIPTION> {
    type: IntegrationType.EMAIL_SUBSCRIPTION,
    onlyAdmin: boolean;
    ignorePreferences: boolean;
    groupId?: UUID
}

export type Integration = IntegrationHttp | IntegrationEmailSubscription | IntegrationCamel;
export type TypedIntegration<T extends IntegrationType> = Extract<Integration, {
    type: T
}>;

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

export type GetIntegrationRecipient = (integrationId: UUID) => Promise<string> | string;
