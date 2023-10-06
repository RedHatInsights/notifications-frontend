import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import { getIntegrationActions } from '../config/Config';
import { UserIntegrationType } from '../types/Integration';

export const useIntegrations = (): ReadonlyArray<UserIntegrationType> => {
    const { getEnvironment, isBeta } = useChrome();
    const environment = `${getEnvironment()}-${isBeta() ? 'beta' : 'stable'}`;

    return getIntegrationActions(environment);
};
