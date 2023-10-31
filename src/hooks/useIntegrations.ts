import { getInsights, getInsightsEnvironment } from '@redhat-cloud-services/insights-common-typescript';

import { getIntegrationActions } from '../config/Config';
import { IntegrationCategory, UserIntegrationType } from '../types/Integration';

export const useIntegrations = (category?: IntegrationCategory): ReadonlyArray<UserIntegrationType> => {
    const insights = getInsights();
    const environment = getInsightsEnvironment(insights);

    return getIntegrationActions(environment, category);
};
