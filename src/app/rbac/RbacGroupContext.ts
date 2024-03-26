import { createContext, useContext } from 'react';

export interface RbacGroup {
  id: string;
  name: string;
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
