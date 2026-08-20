import { IntegrationCamelSchema } from '../Integration';
import { IntegrationType } from '../../../types/Integration';

describe('IntegrationCamelSchema', () => {
  const baseCamelFields = {
    name: 'Test Splunk',
    isEnabled: true,
    url: 'https://splunk.example.com',
    sslVerificationEnabled: true,
  };

  describe('Splunk secretToken validation', () => {
    it('rejects empty secretToken for Splunk', async () => {
      await expect(
        IntegrationCamelSchema.validate({
          ...baseCamelFields,
          type: IntegrationType.SPLUNK,
          secretToken: '',
        })
      ).rejects.toThrow('Splunk HEC token is required.');
    });

    it('rejects undefined secretToken for Splunk', async () => {
      await expect(
        IntegrationCamelSchema.validate({
          ...baseCamelFields,
          type: IntegrationType.SPLUNK,
        })
      ).rejects.toThrow('Splunk HEC token is required.');
    });

    it('rejects whitespace-only secretToken for Splunk', async () => {
      await expect(
        IntegrationCamelSchema.validate({
          ...baseCamelFields,
          type: IntegrationType.SPLUNK,
          secretToken: '   ',
        })
      ).rejects.toThrow();
    });

    it('accepts valid secretToken for Splunk', async () => {
      const result = await IntegrationCamelSchema.validate({
        ...baseCamelFields,
        type: IntegrationType.SPLUNK,
        secretToken: 'my-hec-token',
      });
      expect(result.secretToken).toBe('my-hec-token');
    });

    it('trims secretToken whitespace for Splunk', async () => {
      const result = await IntegrationCamelSchema.validate({
        ...baseCamelFields,
        type: IntegrationType.SPLUNK,
        secretToken: '  my-hec-token  ',
      });
      expect(result.secretToken).toBe('my-hec-token');
    });
  });

  describe('non-Splunk secretToken validation', () => {
    it('allows empty secretToken for ServiceNow', async () => {
      const result = await IntegrationCamelSchema.validate({
        ...baseCamelFields,
        type: IntegrationType.SERVICE_NOW,
        secretToken: '',
      });
      expect(result.secretToken).toBe('');
    });

    it('allows undefined secretToken for Slack', async () => {
      const result = await IntegrationCamelSchema.validate({
        ...baseCamelFields,
        type: IntegrationType.SLACK,
      });
      expect(result.secretToken).toBeUndefined();
    });
  });
});
