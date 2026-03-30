import { createContext, useContext } from 'react';

export interface KesselRbacAccessContextValue {
  /** True while default workspace or Kessel checks are in flight */
  isLoading: boolean;
  canReadRbacGroups: boolean;
  canReadRbacPrincipals: boolean;
  /** True when workspace fetch failed (deny-by-default) */
  workspaceError?: boolean;
  /** True when Kessel check returned an error */
  kesselError?: boolean;
}

export const defaultKesselRbacAccess: KesselRbacAccessContextValue = {
  isLoading: true,
  canReadRbacGroups: false,
  canReadRbacPrincipals: false,
};

export const KesselRbacAccessContext =
  createContext<KesselRbacAccessContextValue>(defaultKesselRbacAccess);

export const useKesselRbacAccess = () => useContext(KesselRbacAccessContext);
