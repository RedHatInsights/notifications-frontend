import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { fn } from 'storybook/test';

// Types
export interface ChromeConfig {
  environment: string;
  [key: string]: any;
}

export interface FeatureFlagsConfig {
  [flagName: string]: boolean;
}

export interface RbacConfig {
  canWriteIntegrationsEndpoints: boolean;
  canReadIntegrationsEndpoints: boolean;
  canWriteNotifications: boolean;
  canReadNotifications: boolean;
  canReadEvents: boolean;
}

export interface AppContextConfig {
  rbac: RbacConfig;
  isOrgAdmin: boolean;
}

// Chrome Context
const ChromeContext = createContext<ChromeConfig>({
  environment: 'prod'
});

export const ChromeProvider: React.FC<{ value: ChromeConfig; children: ReactNode }> = ({ value, children }) => (
  <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>
);

// Feature Flags Context
const FeatureFlagsContext = createContext<FeatureFlagsConfig>({});

export const FeatureFlagsProvider: React.FC<{ value: FeatureFlagsConfig; children: ReactNode }> = ({ value, children }) => (
  <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>
);

// Chrome spy for testing - IS the spy function
export const chromeAppNavClickSpy = fn();

// Mock Hook Implementations (only for Storybook)
export const useChrome = () => {
  const chromeConfig = useContext(ChromeContext);
  
  return useMemo(() => ({
    getEnvironment: () => chromeConfig.environment,
    getEnvironmentDetails: () => ({
      environment: chromeConfig.environment,
      sso: 'https://sso.redhat.com',
      portal: 'https://console.redhat.com'
    }),
    isProd: () => chromeConfig.environment === 'prod',
    isBeta: () => chromeConfig.environment !== 'prod',
    appNavClick: chromeAppNavClickSpy,
    appObjectId: () => undefined,
    appAction: () => undefined,
    updateDocumentTitle: (title: string) => {
      // Mock document title update for Storybook
      if (typeof document !== 'undefined') {
        document.title = title;
      }
    },
    auth: chromeConfig.auth || { 
      getUser: () => Promise.resolve({ 
        identity: { 
          user: { 
            username: 'test-user', 
            email: 'test@redhat.com',
            is_org_admin: true,
            is_internal: false
          } 
        } 
      }), 
      getToken: () => Promise.resolve('mock-jwt-token-12345') 
    },
    getBundle: () => 'settings',
    getApp: () => 'notifications',
    getUserPermissions: () => Promise.resolve([
      { 
        permission: 'notifications:*:*',
        resourceDefinitions: []
      },
      { 
        permission: 'integrations:endpoints:read',
        resourceDefinitions: []
      }, 
      { 
        permission: 'integrations:endpoints:write',
        resourceDefinitions: []
      },
    ]),
    ...chromeConfig
  }), [chromeConfig]);
};

export const useFlag = (flagName: string): boolean => {
  const flags = useContext(FeatureFlagsContext);
  return flags[flagName] || false;
};

// Export contexts for direct use if needed
export { ChromeContext, FeatureFlagsContext };
