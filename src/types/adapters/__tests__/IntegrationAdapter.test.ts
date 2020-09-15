import { toIntegration, toIntegrations, toServerIntegrationRequest } from '../IntegrationAdapter';
import { Integration, IntegrationType, NewIntegration, ServerIntegrationResponse } from '../../Integration';
import { EndpointType, HttpType } from '../../../generated/Openapi';

describe('src/types/adapters/IntegrationAdapter', () => {
    describe('toIntegration', () => {
        it('Success 1', () => {
            const serverIntegration: ServerIntegrationResponse = {
                id: 'foobar',
                enabled: false,
                name: 'my name is',
                description: 'dragons be here',
                type: EndpointType.Enum.webhook,
                properties: {
                    url: 'https://my-cool-webhook.com',
                    disable_ssl_verification: false,
                    method: HttpType.Enum.GET,
                    secret_token: undefined
                }
            };
            const integration = toIntegration(serverIntegration);
            expect(integration).toEqual({
                id: 'foobar',
                name: 'my name is',
                type: IntegrationType.WEBHOOK,
                isEnabled: false,
                url: 'https://my-cool-webhook.com',
                sslVerificationEnabled: true,
                method: 'GET',
                secretToken: undefined
            });
        });

        it('Success 2', () => {
            const serverIntegration: ServerIntegrationResponse = {
                id: 'meep',
                enabled: true,
                name: 'abc',
                description: 'dragons be here',
                type: EndpointType.Enum.webhook,
                properties: {
                    url: 'https://foobarbaz.com',
                    disable_ssl_verification: false,
                    method: HttpType.Enum.GET,
                    secret_token: ''
                }
            };
            const integration = toIntegration(serverIntegration);
            expect(integration).toEqual({
                id: 'meep',
                name: 'abc',
                type: IntegrationType.WEBHOOK,
                isEnabled: true,
                url: 'https://foobarbaz.com',
                sslVerificationEnabled: true,
                method: 'GET',
                secretToken: ''
            });
        });

        it('Not supporting EndpointType.email', () => {
            const serverIntegration: ServerIntegrationResponse = {
                id: 'meep',
                enabled: true,
                name: 'abc',
                description: 'dragons be here',
                type: EndpointType.Enum.email,
                properties: {
                    url: 'https://foobarbaz.com',
                    disable_ssl_verification: false,
                    method: HttpType.Enum.GET,
                    secret_token: ''
                }
            };
            expect(() => toIntegration(serverIntegration)).toThrowError();
        });

        it('Not supporting undefined type', () => {
            const serverIntegration: ServerIntegrationResponse = {
                id: 'meep',
                enabled: true,
                name: 'abc',
                description: 'dragons be here',
                type: undefined as unknown as IntegrationType,
                properties: {
                    url: 'https://foobarbaz.com',
                    disable_ssl_verification: false,
                    method: HttpType.Enum.GET,
                    secret_token: ''
                }
            };
            expect(() => toIntegration(serverIntegration)).toThrowError();
        });

        it('Not supporting unknown types', () => {
            const serverIntegration = {
                id: 'meep',
                enabled: true,
                name: 'abc',
                description: 'dragons be here',
                type: 'im-not-a-valid-type',
                properties: {
                    url: 'https://foobarbaz.com',
                    disable_ssl_verification: false,
                    method: HttpType.Enum.GET,
                    secret_token: ''
                }
            } as unknown as ServerIntegrationResponse;
            expect(() => toIntegration(serverIntegration)).toThrowError();
        });
    });

    describe('toIntegrations', () => {
        it('Parses multiple server integrations', () => {
            const integrations = [
                {
                    id: 'foobar',
                    enabled: false,
                    name: 'my name is',
                    description: 'dragons be here',
                    type: EndpointType.Enum.webhook,
                    properties: {
                        url: 'https://my-cool-webhook.com',
                        disable_ssl_verification: false,
                        method: HttpType.Enum.GET,
                        secret_token: ''
                    }
                },
                {
                    id: 'meep',
                    enabled: true,
                    name: 'abc',
                    description: 'dragons be here',
                    type: EndpointType.Enum.webhook,
                    properties: {
                        url: 'https://foobarbaz.com',
                        disable_ssl_verification: false,
                        method: HttpType.Enum.GET,
                        secret_token: ''
                    }
                }
            ] as Array<ServerIntegrationResponse>;
            expect(toIntegrations(integrations)).toEqual([
                {
                    id: 'foobar',
                    name: 'my name is',
                    type: IntegrationType.WEBHOOK,
                    isEnabled: false,
                    url: 'https://my-cool-webhook.com',
                    sslVerificationEnabled: true,
                    method: 'GET',
                    secretToken: ''
                },
                {
                    id: 'meep',
                    name: 'abc',
                    type: IntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'https://foobarbaz.com',
                    sslVerificationEnabled: true,
                    method: 'GET',
                    secretToken: ''
                }
            ]);
        });

        it('Fails if one integration fail', () => {
            const integrations = [
                {
                    id: 'foobar',
                    enabled: false,
                    name: 'my name is',
                    description: 'dragons be here',
                    type: EndpointType.Enum.webhook,
                    properties: {
                        url: 'https://my-cool-webhook.com',
                        disable_ssl_verification: false,
                        method: HttpType.Enum.GET,
                        secret_token: ''
                    }
                },
                {
                    id: 'meep',
                    enabled: true,
                    name: 'abc',
                    description: 'dragons be here',
                    type: undefined as any,
                    properties: {
                        url: 'https://foobarbaz.com',
                        disable_ssl_verification: false,
                        method: HttpType.Enum.GET,
                        secret_token: ''
                    }
                }
            ];
            expect(() => toIntegrations(integrations)).toThrowError();
        });

        it ('Undefined throws error', () => {
            expect(() => toIntegrations(undefined as any)).toThrowError();
        });
    });

    describe('toServerIntegrationRequest', () => {
        it('parses Integration or NewIntegration to ServerIntegrationRequest', () => {
            const integration: Integration = {
                id: 'foo',
                url: 'https://myurl.com',
                isEnabled: false,
                name: 'meep',
                type: IntegrationType.WEBHOOK,
                method: HttpType.Enum.POST,
                secretToken: undefined,
                sslVerificationEnabled: true
            };

            expect(toServerIntegrationRequest(integration)).toEqual({
                id: 'foo',
                name: 'meep',
                enabled: false,
                type: EndpointType.Enum.webhook,
                description: '',
                properties: {
                    url: 'https://myurl.com',
                    method: 'POST',
                    disable_ssl_verification: false,
                    secret_token: undefined
                }
            });
        });

        it('undefined id is preserved', () => {
            const integration: NewIntegration = {
                id: undefined,
                url: 'https://myurl.com',
                isEnabled: false,
                name: 'meep',
                type: IntegrationType.WEBHOOK,
                sslVerificationEnabled: true,
                secretToken: 'foobar',
                method: HttpType.Enum.GET
            };

            expect(toServerIntegrationRequest(integration)).toEqual({
                id: undefined,
                name: 'meep',
                enabled: false,
                type: EndpointType.Enum.webhook,
                description: '',
                properties: {
                    url: 'https://myurl.com',
                    method: 'GET',
                    disable_ssl_verification: false,
                    secret_token: 'foobar'
                }
            });
        });

        it('unknown endpoint type throw errors', () => {
            const integration: NewIntegration = {
                id: undefined,
                url: 'https://myurl.com',
                isEnabled: false,
                name: 'meep',
                type: 'new-type'
            } as unknown as NewIntegration;

            expect(() => toServerIntegrationRequest(integration)).toThrowError();
        });
    });
});
