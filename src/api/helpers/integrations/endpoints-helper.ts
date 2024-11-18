import { EndpointDTO } from '@redhat-cloud-services/integrations-client/dist/types';
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
  config: EndpointDTO,
  notifications?: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  try {
    await integrationsApi.createEndpoint(config);
    notifications.addSuccessNotification(
      'Integration created',
      `The integration ${
        config.name ? `${config.name} ` : ''
      }was created successfully.`
    );
  } catch (e) {
    notifications.addDangerNotification(
      'Failed to create integration',
      formatError(e)
    ) || console.error(e);
  }
}

export async function updateEndpoint(
  id: string,
  data: EndpointDTO,
  config?: AxiosRequestConfig,
  notifications?: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  try {
    await integrationsApi.updateEndpoint(id, data, config);
    notifications?.addSuccessNotification(
      'Integration updated',
      `The integration ${
        data.name ? `${data.name} ` : ''
      }was updated successfully.`
    );
  } catch (e) {
    notifications?.addDangerNotification(
      'Failed to update integration',
      formatError(e)
    ) || console.error(e);
  }
}
