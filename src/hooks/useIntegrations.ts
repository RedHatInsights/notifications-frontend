import { useFlag } from '@unleash/proxy-client-react';
import { getIntegrationActions } from '../config/Config';
import { IntegrationCategory, UserIntegrationType } from '../types/Integration';
import {
  getInsights,
  getInsightsEnvironment,
} from '../utils/insights-common-typescript';

export const useIntegrations = (
  category?: IntegrationCategory
): ReadonlyArray<UserIntegrationType> => {
  const insights = getInsights();
  const environment = getInsightsEnvironment(insights);
  const isEmailIntegrationEnabled = useFlag(
    'platform.notifications.email.integration'
  );

  const integrations = getIntegrationActions(environment, category);

  // Filter out EMAIL integration if feature flag is not enabled
  if (!isEmailIntegrationEnabled) {
    return integrations.filter(
      (integration) => integration !== UserIntegrationType.EMAIL
    );
  }

  return integrations;
};
