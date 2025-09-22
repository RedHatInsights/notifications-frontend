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
  config: Endpoint & { user_access_groups }, // Allow user_access_groups for email integrations
  notifications?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  afterSubmit?: () => void
) {
  try {
    // Handle email subscription integrations with special endpoint
    if (config.type === 'email_subscription') {
      const emailData = {
        only_admins: false, // Default to false, could be made configurable
        group_id: config.user_access_groups?.[0]?.id, // Use the first selected group's ID
      };

      // Use the email subscription specific API
      const response = await fetch(
        '/api/integrations/v1.0/endpoints/system/email_subscription',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `Failed to create email subscription: ${response.status} - ${error}`
        );
      }
    } else {
      // Use standard endpoint for other integrations
      await integrationsApi.createEndpoint(config);
    }

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
