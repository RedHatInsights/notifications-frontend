import './App.scss';
import { Bullseye, Spinner } from '@patternfly/react-core';
import * as React from 'react';
import { NotificationsPortal } from '../components/Store/NotificationsPortal';
import IntegrationsList from '../pages/Integrations/List/List';
import { IntegrationCategory } from '../types/Integration';
import { AppContext } from './AppContext';
import { RbacGroupContextProvider } from './rbac/RbacGroupContextProvider';
import { useApp } from './useApp';

interface IntegrationsAppProps {
  activeCategory?: string;
}

const IntegrationsApp: React.ComponentType<IntegrationsAppProps> = ({
  activeCategory,
  ...props
}: IntegrationsAppProps) => {
  const { rbac, server, isOrgAdmin } = useApp();

  const category =
    activeCategory &&
    Object.values(IntegrationCategory).includes(
      activeCategory as unknown as IntegrationCategory
    )
      ? (activeCategory as IntegrationCategory)
      : undefined;

  return rbac && server ? (
    <AppContext.Provider
      value={{
        rbac,
        server,
        isOrgAdmin: !!isOrgAdmin,
      }}
    >
      <RbacGroupContextProvider>
        <NotificationsPortal />
        <IntegrationsList category={category} {...props} />
      </RbacGroupContextProvider>
    </AppContext.Provider>
  ) : (
    <Bullseye>
      <Spinner size="xl" />
    </Bullseye>
  );
};

export default IntegrationsApp;
