import { createContext, useContext } from 'react';

export interface KesselRbacAccessContextValue {
  /** True while default workspace or Kessel checks are in flight */
  isLoading: boolean;
  /** Maps Kessel `notifications_notifications_view` */
  canReadNotifications: boolean;
  /** Maps Kessel `notifications_notifications_edit` */
  canWriteNotifications: boolean;
  /** Maps Kessel `integrations_endpoints_view` */
  canReadIntegrationsEndpoints: boolean;
  /** Maps Kessel `integrations_endpoints_edit` */
  canWriteIntegrationsEndpoints: boolean;
  /** Maps Kessel `notifications_events_view` */
  canReadEvents: boolean;
  canReadRbacGroups: boolean;
  canReadRbacPrincipals: boolean;
  /** True when workspace fetch failed (deny-by-default) */
  workspaceError?: boolean;
  /** True when Kessel check returned an error */
  kesselError?: boolean;
}

export const defaultKesselRbacAccess: KesselRbacAccessContextValue = {
  isLoading: true,
  canReadNotifications: false,
  canWriteNotifications: false,
  canReadIntegrationsEndpoints: false,
  canWriteIntegrationsEndpoints: false,
  canReadEvents: false,
  canReadRbacGroups: false,
  canReadRbacPrincipals: false,
};

export const KesselRbacAccessContext =
  createContext<KesselRbacAccessContextValue>(defaultKesselRbacAccess);

export const useKesselRbacAccess = () => useContext(KesselRbacAccessContext);
