import './App.scss';

import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import { Bullseye, Spinner } from '@patternfly/react-core';
import * as React from 'react';

import IntegrationsList from '../pages/Integrations/List/List';
import { IntegrationCategory } from '../types/Integration';
import { AppContext } from './AppContext';
import { KesselRbacAccessProvider } from './rbac/KesselRbacAccessProvider';
import { RbacGroupContextProvider } from './rbac/RbacGroupContextProvider';
import { useApp } from './useApp';
import { AppEntryProps } from '../AppEntry';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';

interface IntegrationsAppProps {
  activeCategory?: string;
}

const IntegrationsApp: React.ComponentType<
  IntegrationsAppProps & AppEntryProps
> = ({ activeCategory, ...props }: IntegrationsAppProps) => {
  const { rbac, server, isOrgAdmin } = useApp();

  const category =
    activeCategory &&
    Object.values(IntegrationCategory).includes(
      activeCategory as unknown as IntegrationCategory
    )
      ? (activeCategory as IntegrationCategory)
      : undefined;

  const apiBaseUrl =
    typeof window !== 'undefined' ? window.location.origin : '';

  return rbac && server ? (
    <AppContext.Provider
      value={{
        rbac,
        server,
        isOrgAdmin: !!isOrgAdmin,
      }}
    >
      <AccessCheck.Provider baseUrl={apiBaseUrl} apiPath="/api/kessel/v1beta2">
        <KesselRbacAccessProvider>
          <RbacGroupContextProvider>
            <NotificationsProvider>
              <IntegrationsList category={category} {...props} />
            </NotificationsProvider>
          </RbacGroupContextProvider>
        </KesselRbacAccessProvider>
      </AccessCheck.Provider>
    </AppContext.Provider>
  ) : (
    <Bullseye>
      <Spinner size="xl" />
    </Bullseye>
  );
};

export default IntegrationsApp;
