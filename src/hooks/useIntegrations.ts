import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
import { getIntegrationActions } from '../config/Config';
import { IntegrationCategory, UserIntegrationType } from '../types/Integration';
import { getInsightsEnvironment } from '../utils/insights-common-typescript';

export const useIntegrations = (
  category?: IntegrationCategory
): ReadonlyArray<UserIntegrationType> => {
  const { getEnvironment, isBeta } = useChrome();
  const environment = getInsightsEnvironment(isBeta(), getEnvironment());
  const isEmailIntegrationEnabled = useFlag('platform.notifications.email.integration');

  const integrations = getIntegrationActions(environment, category);

  if (!isEmailIntegrationEnabled) {
    return integrations.filter((integration) => integration !== UserIntegrationType.EMAIL);
  }

  return integrations;
};
