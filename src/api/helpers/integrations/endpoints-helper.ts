import { Endpoint } from '@redhat-cloud-services/integrations-client/dist/types';
import { getIntegrationsApi } from '../../api';
import { AxiosRequestConfig } from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Operations } from '../../generated/OpenapiIntegrations';

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
  afterSubmit?: () => void,
  query?: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  try {
    // Handle email subscription integrations with special endpoint
    if (config.type === 'email_subscription') {
      const emailData = {
        only_admins: false, // Default to false, could be made configurable
        group_id: config.user_access_groups?.[0], // user_access_groups is already an array of IDs
      };

      console.log('Email integration config:', config);
      console.log('Email integration payload:', emailData);

      if (query) {
        // Use the generated OpenAPI client with react-fetching-library (proper way)
        const action =
          Operations.EndpointResource$v1GetOrCreateEmailSubscriptionEndpoint.actionCreator(
            {
              body: emailData,
            }
          );

        const result = await query(action);

        if (result.error || result.payload?.type !== 'Endpoint') {
          console.error('Email integration creation failed:', result);
          throw new Error('Failed to create email subscription endpoint');
        }

        console.log(
          'Email integration created successfully:',
          result.payload.value
        );
      } else {
        // Fallback to manual fetch if query function not provided
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
          console.error('Email integration creation failed:', {
            status: response.status,
            error: error,
          });
          throw new Error(
            `Failed to create email subscription: ${response.status} - ${error}`
          );
        }

        const responseData = await response.json();
        console.log('Email integration created successfully:', responseData);
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
    console.log('Calling afterSubmit to refresh list...');
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
