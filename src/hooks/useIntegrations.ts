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

  return getIntegrationActions(environment, category);
};
