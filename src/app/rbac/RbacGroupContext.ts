import { createContext, useContext } from 'react';

export interface RbacGroup {
  id: string;
  name: string;
  principalCount?: number;
  admin_default?: boolean;
  platform_default?: boolean;
  system?: boolean;
}

export interface RbacGroupContext {
  groups: ReadonlyArray<RbacGroup>;
  isLoading: boolean;
}

export const RbacGroupContext = createContext<RbacGroupContext>({
  groups: [],
  isLoading: true,
});

export const useRbacGroups = () => {
  return useContext(RbacGroupContext);
};
