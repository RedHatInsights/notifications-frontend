import { getInsights, getInsightsEnvironment } from '@redhat-cloud-services/insights-common-typescript';

import { getIntegrationActions } from '../config/Config';
import { UserIntegrationType } from '../types/Integration';

export const useIntegrations = (): ReadonlyArray<UserIntegrationType> => {
    const insights = getInsights();
    const environment = getInsightsEnvironment(insights);

    return getIntegrationActions(environment);
};
