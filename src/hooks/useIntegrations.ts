import Config from '../config/Config';
import { isReleased, isStable } from '../types/Environments';
import { UserIntegrationType } from '../types/Integration';

export const useIntegrations = (): ReadonlyArray<UserIntegrationType> => {
    const released = isReleased();
    const stable = isStable();

    if (released) {
        if (stable) {
            return Config.integrations.actions.stable;
        }

        return Config.integrations.actions.beta;
    }

    return Config.integrations.actions.experimental;
};
