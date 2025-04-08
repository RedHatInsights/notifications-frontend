import { Endpoint } from '@redhat-cloud-services/integrations-client/dist/types';
import { getIntegrationsApi } from '../../api';
import { AxiosRequestConfig } from 'axios';

const integrationsApi = getIntegrationsApi();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatError = (error: any): string => {
  const title = error.title || '';
  const violations = error.violations
    ? error.violations
        .map((violation) => `${violation.field}: ${violation.message}`)
        .join('; ')
    : '';

  return `${title}${violations ? ` - ${violations}` : ''}`;
};

export async function createEndpoint(
  config: Endpoint,
  notifications?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  afterSubmit?: () => void
) {
  try {
    await integrationsApi.createEndpoint(config);
    notifications.addSuccessNotification(
      'Integration created',
      `The integration ${
        config.name ? `${config.name} ` : ''
      }was created successfully.`
    );
    afterSubmit?.();
  } catch (e) {
    notifications.addDangerNotification(
      'Failed to create integration',
      formatError(e)
    ) || console.error(e);
  }
}

export async function updateEndpoint(
  id: string,
  data: Endpoint,
  config?: AxiosRequestConfig,
  notifications?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  afterSubmit?: () => void
) {
  try {
    await integrationsApi.updateEndpoint(id, data, config);
    notifications?.addSuccessNotification(
      'Integration updated',
      `The integration ${
        data.name ? `${data.name} ` : ''
      }was updated successfully.`
    );
    afterSubmit?.();
  } catch (e) {
    notifications?.addDangerNotification(
      'Failed to update integration',
      formatError(e)
    ) || console.error(e);
  }
}

export async function getEndpoint(id) {
  return await integrationsApi.getEndpoint(id);
}

export async function getEndpoints({ name }: { name?: string }) {
  return await integrationsApi.getEndpoints({ name });
}
