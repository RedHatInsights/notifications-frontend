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

/**
 * Inner component that uses RBAC hooks.
 * Must be rendered inside KesselRbacAccessProvider.
 */
const IntegrationsAppContent: React.FC<IntegrationsAppProps & AppEntryProps> = ({
  activeCategory,
  ...props
}) => {
  const { rbac, server, isOrgAdmin } = useApp();

  const category =
    activeCategory &&
    Object.values(IntegrationCategory).includes(activeCategory as unknown as IntegrationCategory)
      ? (activeCategory as IntegrationCategory)
      : undefined;

  if (!rbac || !server) {
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  }

  return (
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
  );
};

/**
 * Main integrations app component - sets up Kessel RBAC provider.
 */
const IntegrationsApp: React.ComponentType<IntegrationsAppProps & AppEntryProps> = (props) => {
  return (
    <AccessCheck.Provider baseUrl={window.location.origin} apiPath="/api/kessel/v1beta2">
      <KesselRbacAccessProvider>
        <IntegrationsAppContent {...props} />
      </KesselRbacAccessProvider>
    </AccessCheck.Provider>
  );
};

export default IntegrationsApp;
