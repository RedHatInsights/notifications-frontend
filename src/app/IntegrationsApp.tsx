import './App.scss';

import { Bullseye, Spinner } from '@patternfly/react-core';
import * as React from 'react';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';

import IntegrationsList from '../pages/Integrations/List/List';
import { IntegrationCategory } from '../types/Integration';
import { AppContext } from './AppContext';
import { RbacGroupContextProvider } from './rbac/RbacGroupContextProvider';
import { KesselRbacAccessProvider } from './rbac/KesselRbacAccessProvider';
import { useApp } from './useApp';
import { AppEntryProps } from '../AppEntry';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';

interface IntegrationsAppProps {
  activeCategory?: string;
}

const IntegrationsApp: React.ComponentType<IntegrationsAppProps & AppEntryProps> = ({
  activeCategory,
  ...props
}: IntegrationsAppProps) => {
  const { rbac, server, isOrgAdmin } = useApp();

  const category =
    activeCategory &&
    Object.values(IntegrationCategory).includes(activeCategory as unknown as IntegrationCategory)
      ? (activeCategory as IntegrationCategory)
      : undefined;

  return rbac && server ? (
    <AccessCheck.Provider baseUrl={window.location.origin} apiPath="/api/rbac/v2">
      <KesselRbacAccessProvider>
        <AppContext.Provider
          value={{
            rbac,
            server,
            isOrgAdmin: !!isOrgAdmin,
          }}
        >
          <RbacGroupContextProvider>
            <NotificationsProvider>
              <IntegrationsList category={category} {...props} />
            </NotificationsProvider>
          </RbacGroupContextProvider>
        </AppContext.Provider>
      </KesselRbacAccessProvider>
    </AccessCheck.Provider>
  ) : (
    <Bullseye>
      <Spinner size="xl" />
    </Bullseye>
  );
};

export default IntegrationsApp;
