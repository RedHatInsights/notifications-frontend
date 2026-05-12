import { KesselRbacAccessContextValue } from '../KesselRbacAccessContext';
import { AppContext } from '../../AppContext';

/**
 * Maps v2 Kessel permissions to v1 AppContext permission structure.
 * This allows v2 orgs to use the existing AppContext API.
 *
 * Permission mapping:
 * - canViewIntegrationsEndpoints → canReadIntegrationsEndpoints
 * - canEditIntegrationsEndpoints → canWriteIntegrationsEndpoints
 * - canViewNotifications → canReadNotifications
 * - canEditNotifications → canWriteNotifications
 * - canViewNotificationsEvents → canReadEvents
 */
export const mapKesselToV1Permissions = (
  kesselPermissions: KesselRbacAccessContextValue['permissions']
): AppContext['rbac'] => {
  return {
    // v2: canViewIntegrationsEndpoints → v1: canReadIntegrationsEndpoints
    canReadIntegrationsEndpoints: kesselPermissions.canViewIntegrationsEndpoints,

    // v2: canEditIntegrationsEndpoints → v1: canWriteIntegrationsEndpoints
    canWriteIntegrationsEndpoints: kesselPermissions.canEditIntegrationsEndpoints,

    // v2: canViewNotifications → v1: canReadNotifications
    canReadNotifications: kesselPermissions.canViewNotifications,

    // v2: canEditNotifications → v1: canWriteNotifications
    canWriteNotifications: kesselPermissions.canEditNotifications,

    // v2: canViewNotificationsEvents → v1: canReadEvents
    canReadEvents: kesselPermissions.canViewNotificationsEvents,
  };
};
