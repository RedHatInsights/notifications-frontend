import { toIntegration, toIntegrations, toServerIntegrationRequest } from '../IntegrationAdapter';
import { Integration, IntegrationType, NewIntegration, ServerIntegrationResponse } from '../../Integration';
import { EndpointType, HttpType } from '../../../generated/Types';

describe('src/types/adapters/IntegrationAdapter', () => {
    describe('toIntegration', () => {
        it('Success 1', () => {
            const serverIntegration: ServerIntegrationResponse = {
                id: 'foobar',
                enabled: false,
                name: 'my name is',
                description: 'dragons be here',
                type: EndpointType.webhook,
                properties: {
                    url: 'https://my-cool-webhook.com',
                    disable_ssl_verification: false,
                    method: HttpType.GET,
                    secret_token: ''
                }
            };
            const integration = toIntegration(serverIntegration);
            expect(integration).toEqual({
                id: 'foobar',
                name: 'my name is',
                type: IntegrationType.WEBHOOK,
                isEnabled: false,
                url: 'https://my-cool-webhook.com'
            });
        });

        it('Success 2', () => {
            const serverIntegration: ServerIntegrationResponse = {
                id: 'meep',
                enabled: true,
                name: 'abc',
                description: 'dragons be here',
                type: EndpointType.webhook,
                properties: {
                    url: 'https://foobarbaz.com',
                    disable_ssl_verification: false,
                    method: HttpType.GET,
                    secret_token: ''
                }
            };
            const integration = toIntegration(serverIntegration);
            expect(integration).toEqual({
                id: 'meep',
                name: 'abc',
                type: IntegrationType.WEBHOOK,
                isEnabled: true,
                url: 'https://foobarbaz.com'
            });
        });

        it('Not supporting EndpointType.email', () => {
            const serverIntegration: ServerIntegrationResponse = {
                id: 'meep',
                enabled: true,
                name: 'abc',
                description: 'dragons be here',
                type: EndpointType.email,
                properties: {
                    url: 'https://foobarbaz.com',
                    disable_ssl_verification: false,
                    method: HttpType.GET,
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
                type: undefined,
                properties: {
                    url: 'https://foobarbaz.com',
                    disable_ssl_verification: false,
                    method: HttpType.GET,
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
                    method: HttpType.GET,
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
                    type: EndpointType.webhook,
                    properties: {
                        url: 'https://my-cool-webhook.com',
                        disable_ssl_verification: false,
                        method: HttpType.GET,
                        secret_token: ''
                    }
                },
                {
                    id: 'meep',
                    enabled: true,
                    name: 'abc',
                    description: 'dragons be here',
                    type: EndpointType.webhook,
                    properties: {
                        url: 'https://foobarbaz.com',
                        disable_ssl_verification: false,
                        method: HttpType.GET,
                        secret_token: ''
                    }
                }
            ];
            expect(toIntegrations(integrations)).toEqual([
                {
                    id: 'foobar',
                    name: 'my name is',
                    type: IntegrationType.WEBHOOK,
                    isEnabled: false,
                    url: 'https://my-cool-webhook.com'
                },
                {
                    id: 'meep',
                    name: 'abc',
                    type: IntegrationType.WEBHOOK,
                    isEnabled: true,
                    url: 'https://foobarbaz.com'
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
                    type: EndpointType.webhook,
                    properties: {
                        url: 'https://my-cool-webhook.com',
                        disable_ssl_verification: false,
                        method: HttpType.GET,
                        secret_token: ''
                    }
                },
                {
                    id: 'meep',
                    enabled: true,
                    name: 'abc',
                    description: 'dragons be here',
                    type: undefined,
                    properties: {
                        url: 'https://foobarbaz.com',
                        disable_ssl_verification: false,
                        method: HttpType.GET,
                        secret_token: ''
                    }
                }
            ];
            expect(() => toIntegrations(integrations)).toThrowError();
        });

        it ('Undefined returns an empty array', () => {
            expect(toIntegrations(undefined)).toEqual([]);
        });
    });

    describe('toServerIntegrationRequest', () => {
        it('parses Integration or NewIntegration to ServerIntegrationRequest', () => {
            const integration: Integration = {
                id: 'foo',
                url: 'https://myurl.com',
                isEnabled: false,
                name: 'meep',
                type: IntegrationType.WEBHOOK
            };

            expect(toServerIntegrationRequest(integration)).toEqual({
                id: 'foo',
                name: 'meep',
                enabled: false,
                type: EndpointType.webhook,
                description: '',
                properties: {
                    url: 'https://myurl.com',
                    method: 'GET',
                    disable_ssl_verification: false,
                    secret_token: ''
                }
            });
        });

        it('undefined id is preserved', () => {
            const integration: NewIntegration = {
                id: undefined,
                url: 'https://myurl.com',
                isEnabled: false,
                name: 'meep',
                type: IntegrationType.WEBHOOK
            };

            expect(toServerIntegrationRequest(integration)).toEqual({
                id: undefined,
                name: 'meep',
                enabled: false,
                type: EndpointType.webhook,
                description: '',
                properties: {
                    url: 'https://myurl.com',
                    method: 'GET',
                    disable_ssl_verification: false,
                    secret_token: ''
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
