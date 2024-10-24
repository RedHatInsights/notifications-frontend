import { Schemas } from '../../../generated/OpenapiIntegrations';
import {
  Integration,
  IntegrationHttp,
  IntegrationType,
  NewIntegration,
  NewIntegrationTemplate,
  ServerIntegrationResponse,
} from '../../Integration';
import {
  toIntegration,
  toIntegrations,
  toServerIntegrationRequest,
} from '../IntegrationAdapter';

describe('src/types/adapters/IntegrationAdapter', () => {
  describe('toIntegration', () => {
    it('Success 1', () => {
      const serverIntegration: ServerIntegrationResponse = {
        id: 'foobar',
        enabled: false,
        name: 'my name is',
        description: 'dragons be here',
        type: Schemas.EndpointType.Enum.webhook,
        properties: {
          url: 'https://my-cool-webhook.com',
          disableSslVerification: false,
          method: Schemas.HttpType.Enum.GET,
          secretToken: undefined,
        },
        server_errors: 5,
        status: 'READY',
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
        secretToken: undefined,
        serverErrors: 5,
        status: 'READY',
      });
    });

    it('Success 2', () => {
      const serverIntegration: ServerIntegrationResponse = {
        id: 'meep',
        enabled: true,
        name: 'abc',
        description: 'dragons be here',
        type: Schemas.EndpointType.Enum.webhook,
        properties: {
          url: 'https://foobarbaz.com',
          disableSslVerification: false,
          method: Schemas.HttpType.Enum.GET,
          secretToken: '',
        },
        server_errors: 5,
        status: 'READY',
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
        secretToken: undefined,
        serverErrors: 5,
        status: 'READY',
      });
    });

    it('Not supporting undefined type', () => {
      const serverIntegration: ServerIntegrationResponse = {
        id: 'meep',
        enabled: true,
        name: 'abc',
        description: 'dragons be here',
        type: undefined as unknown as Schemas.EndpointTypeDTO,
        properties: {
          url: 'https://foobarbaz.com',
          disableSslVerification: false,
          method: Schemas.HttpType.Enum.GET,
          secretToken: '',
        },
      };
      expect(() => toIntegration(serverIntegration)).toThrow();
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
          method: Schemas.HttpType.Enum.GET,
          secret_token: '',
        },
      } as unknown as ServerIntegrationResponse;
      expect(() => toIntegration(serverIntegration)).toThrow();
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
          type: Schemas.EndpointType.Enum.webhook,
          properties: {
            url: 'https://my-cool-webhook.com',
            disable_ssl_verification: false,
            method: Schemas.HttpType.Enum.GET,
            secretToken: 'my-token',
          },
          server_errors: 3,
          status: 'PROVISIONING',
        },
        {
          id: 'meep',
          enabled: true,
          name: 'abc',
          description: 'dragons be here',
          type: Schemas.EndpointType.Enum.webhook,
          properties: {
            url: 'https://foobarbaz.com',
            disableSslVerification: false,
            method: Schemas.HttpType.Enum.GET,
            secretToken: '',
          },
          server_errors: 7,
          status: 'FAILED',
        },
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
          secretToken: 'my-token',
          serverErrors: 3,
          status: 'PROVISIONING',
        },
        {
          id: 'meep',
          name: 'abc',
          type: IntegrationType.WEBHOOK,
          isEnabled: true,
          url: 'https://foobarbaz.com',
          sslVerificationEnabled: true,
          method: 'GET',
          secretToken: undefined,
          serverErrors: 7,
          status: 'FAILED',
        },
      ]);
    });

    it('Fails if one integration fail', () => {
      const integrations = [
        {
          id: 'foobar',
          enabled: false,
          name: 'my name is',
          description: 'dragons be here',
          type: Schemas.EndpointType.Enum.webhook,
          properties: {
            url: 'https://my-cool-webhook.com',
            disableSslVerification: false,
            method: Schemas.HttpType.Enum.GET,
            secretToken: '',
          },
        },
        {
          id: 'meep',
          enabled: true,
          name: 'abc',
          description: 'dragons be here',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          type: undefined as any,
          properties: {
            url: 'https://foobarbaz.com',
            disableSslVerification: false,
            method: Schemas.HttpType.Enum.GET,
            secretToken: '',
          },
        },
      ];
      expect(() => toIntegrations(integrations)).toThrow();
    });

    it('Undefined throws error', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => toIntegrations(undefined as any)).toThrow();
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
        method: Schemas.HttpType.Enum.POST,
        secretToken: undefined,
        sslVerificationEnabled: true,
        serverErrors: 5,
        status: 'READY',
      };

      expect(toServerIntegrationRequest(integration)).toEqual({
        id: 'foo',
        name: 'meep',
        enabled: false,
        type: Schemas.EndpointType.Enum.webhook,
        description: '',
        properties: {
          url: 'https://myurl.com',
          method: 'POST',
          disableSslVerification: false,
          secretToken: undefined,
        },
        sub_type: undefined,
      });
    });

    it('undefined id is preserved', () => {
      const integration: NewIntegrationTemplate<IntegrationHttp> = {
        id: undefined,
        url: 'https://myurl.com',
        isEnabled: false,
        name: 'meep',
        type: IntegrationType.WEBHOOK,
        sslVerificationEnabled: true,
        secretToken: 'foobar',
        method: Schemas.HttpType.Enum.GET,
      };

      expect(toServerIntegrationRequest(integration)).toEqual({
        id: undefined,
        name: 'meep',
        enabled: false,
        type: Schemas.EndpointType.Enum.webhook,
        description: '',
        properties: {
          url: 'https://myurl.com',
          method: 'GET',
          disableSslVerification: false,
          secretToken: 'foobar',
        },
      });
    });

    it('unknown endpoint type throw errors', () => {
      const integration: NewIntegration = {
        id: undefined,
        url: 'https://myurl.com',
        isEnabled: false,
        name: 'meep',
        type: 'new-type',
      } as unknown as NewIntegration;

      expect(() => toServerIntegrationRequest(integration)).toThrow();
    });
  });
});
