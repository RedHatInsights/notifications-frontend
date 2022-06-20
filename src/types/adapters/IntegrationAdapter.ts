import { assertNever } from 'assert-never';

import { Schemas } from '../../generated/OpenapiIntegrations';
import {
    CamelIntegrationType,
    Integration,
    IntegrationBase,
    IntegrationCamel,
    IntegrationEmailSubscription,
    IntegrationHttp,
    IntegrationType, isCamelType,
    NewIntegration,
    ServerIntegrationRequest,
    ServerIntegrationResponse
} from '../Integration';

interface ExternalCompositeTyped {
    type: string;
    subType?: string | null;
}

export const getIntegrationType = (serverIntegration: ExternalCompositeTyped): IntegrationType => {
    for (const integration of Object.values(IntegrationType)) {
        if (serverIntegration.subType) {
            if (integration === `${serverIntegration.type}:${serverIntegration.subType}`) {
                return integration as IntegrationType;
            }
        } else if (integration === serverIntegration.type) {
            return integration as IntegrationType;
        }
    }

    throw new Error(`Unexpected type: ${serverIntegration.type} with subtype: ${serverIntegration.subType}`);
};

const getEndpointType = (type: IntegrationType): { type: Schemas.EndpointType, subType?: string } => {
    const splitType = type.split(':', 2);
    return {
        type: splitType[0] as Schemas.EndpointType,
        subType: splitType.length === 2 ? splitType[1] : undefined
    };
};

type NotNullType = {
    <T>(value: T | undefined | null): T | undefined;
    <T>(value: T | undefined | null, defaultValue: T): T;
}

const notNull: NotNullType = <T>(value: T | undefined | null, defaultValue?: T): T | undefined => value === null ? defaultValue : value;
const toSecretToken = (secretToken: string | undefined | null): string | undefined => secretToken === '' ? undefined : notNull(secretToken);

const toIntegrationWebhook = (
    integrationBase: IntegrationBase<IntegrationType.WEBHOOK>,
    properties?: Schemas.WebhookProperties): IntegrationHttp => ({
    ...integrationBase,
    url: properties?.url ?? '',
    sslVerificationEnabled: !properties?.disableSslVerification ?? false,
    secretToken: toSecretToken(properties?.secretToken),
    method: properties?.method ?? Schemas.HttpType.Enum.GET
});

const toIntegrationCamel = (
    integrationBase: IntegrationBase<CamelIntegrationType>,
    properties?: Schemas.CamelProperties): IntegrationCamel => ({
    ...integrationBase,
    url: properties?.url ?? '',
    sslVerificationEnabled: !properties?.disableSslVerification ?? false,
    secretToken: toSecretToken(properties?.secretToken),
    basicAuth: properties?.basicAuthentication === null ?
        undefined
        :
        {
            user: notNull(properties?.basicAuthentication?.username, ''),
            pass: notNull(properties?.basicAuthentication?.password, '')
        },
    extras: notNull(properties?.extras)
});

const toIntegrationEmail = (
    integrationBase: IntegrationBase<IntegrationType.EMAIL_SUBSCRIPTION>,
    properties: Schemas.EmailSubscriptionProperties): IntegrationEmailSubscription => ({
    ...integrationBase,
    ignorePreferences: properties.ignorePreferences,
    groupId: properties.groupId === null ? undefined : properties.groupId,
    onlyAdmin: properties.onlyAdmins
});

export const toIntegration = (serverIntegration: ServerIntegrationResponse): Integration => {

    const integrationBase: IntegrationBase<IntegrationType> = {
        id: serverIntegration.id || '',
        name: serverIntegration.name || '',
        isEnabled: !!serverIntegration.enabled,
        type: getIntegrationType(serverIntegration)
    };

    if (isCamelType(integrationBase.type)) {
        return toIntegrationCamel(
            integrationBase as IntegrationBase<CamelIntegrationType>,
            serverIntegration.properties as Schemas.CamelProperties
        );
    }

    switch (integrationBase.type) {
        case IntegrationType.WEBHOOK:
            return toIntegrationWebhook(
                integrationBase as IntegrationBase<IntegrationType.WEBHOOK>,
                serverIntegration.properties as Schemas.WebhookProperties
            );
        case IntegrationType.EMAIL_SUBSCRIPTION:
            return toIntegrationEmail(
                integrationBase as IntegrationBase<IntegrationType.EMAIL_SUBSCRIPTION>,
                serverIntegration.properties as Schemas.EmailSubscriptionProperties
            );
        default:
            assertNever(integrationBase.type);
    }
};

export const toIntegrations = (serverIntegrations: Array<ServerIntegrationResponse>): Array<Integration> => {
    return serverIntegrations
    .filter(filterOutDefaultAction)
    .map(toIntegration);
};

type ServerIntegrationProperties = Schemas.EmailSubscriptionProperties | Schemas.WebhookProperties | Schemas.CamelProperties

export const toIntegrationProperties = (integration: Integration | NewIntegration): ServerIntegrationProperties => {

    const type = integration.type;

    if (isCamelType(type)) {
        const integrationCamel: IntegrationCamel = integration as IntegrationCamel;
        return {
            url: integrationCamel.url,
            disableSslVerification: !integrationCamel.sslVerificationEnabled,
            secretToken: toSecretToken(integrationCamel.secretToken),
            basicAuthentication: integrationCamel.basicAuth ? {
                username: integrationCamel.basicAuth.user,
                password: integrationCamel.basicAuth.pass
            } : undefined,
            extras: integrationCamel.extras
        };
    }

    switch (type) {
        case IntegrationType.WEBHOOK:
            const integrationHttp: IntegrationHttp = integration as IntegrationHttp;
            return {
                url: integrationHttp.url,
                method: integrationHttp.method,
                disableSslVerification: !integrationHttp.sslVerificationEnabled,
                secretToken: toSecretToken(integrationHttp.secretToken)
            };
        case IntegrationType.EMAIL_SUBSCRIPTION:
            const integrationEmail: IntegrationEmailSubscription = integration as IntegrationEmailSubscription;
            return {
                onlyAdmins: integrationEmail.onlyAdmin,
                groupId: integrationEmail.groupId,
                ignorePreferences: integrationEmail.ignorePreferences
            };
        default:
            assertNever(type);
    }
};

export const toServerIntegrationRequest =
    (integration: Integration | NewIntegration): ServerIntegrationRequest => {
        const { type, subType } = getEndpointType(integration.type);
        return {
            id: integration.id,
            name: integration.name,
            enabled: integration.isEnabled,
            type,
            subType,
            description: '',
            properties: toIntegrationProperties(integration)
        };
    };

export const filterOutDefaultAction = (serverNotification: ServerIntegrationResponse) =>
    serverNotification.type !== Schemas.EndpointType.enum.default;
