/**
 * Shared types for Storybook decorator arguments
 * These can be used across all stories to ensure consistency
 */

// AppContext decorator arguments
export interface AppContextArgs {
  isOrgAdmin?: boolean;
  canWriteNotifications?: boolean;
  canReadNotifications?: boolean;
  canWriteIntegrationsEndpoints?: boolean;
  canReadIntegrationsEndpoints?: boolean;
  canReadEvents?: boolean;
}

// Chrome decorator arguments  
export interface ChromeArgs {
  environment?: 'prod' | 'stage' | 'ci-beta' | 'ci-stable' | 'qa-beta' | 'qa-stable';
}

// Feature flags decorator arguments
export interface FeatureFlagsArgs {
  [flagName: string]: boolean;
}

// Combined decorator arguments
export interface DecoratorArgs extends AppContextArgs, ChromeArgs {
  featureFlags?: FeatureFlagsArgs;
}

// Utility type to create story args by extending component props with decorator args
export type StoryArgs<T = {}> = T & DecoratorArgs;

// Default values for decorator arguments
export const DEFAULT_DECORATOR_ARGS: DecoratorArgs = {
  isOrgAdmin: false,
  canWriteNotifications: true,
  canReadNotifications: true,
  canWriteIntegrationsEndpoints: true,
  canReadIntegrationsEndpoints: true,
  canReadEvents: true,
  environment: 'prod',
};

// ArgTypes configuration for decorator controls
export const DECORATOR_ARG_TYPES = {
  // AppContext controls
  isOrgAdmin: {
    control: 'boolean',
    description: 'Organization admin status',
    table: {
      category: 'AppContext',
    },
  },
  canWriteNotifications: {
    control: 'boolean',
    description: 'Permission to write notifications',
    table: {
      category: 'AppContext',
    },
  },
  canReadNotifications: {
    control: 'boolean',
    description: 'Permission to read notifications',
    table: {
      category: 'AppContext',
    },
  },
  canWriteIntegrationsEndpoints: {
    control: 'boolean',
    description: 'Permission to write integrations endpoints',
    table: {
      category: 'AppContext',
    },
  },
  canReadIntegrationsEndpoints: {
    control: 'boolean',
    description: 'Permission to read integrations endpoints',
    table: {
      category: 'AppContext',
    },
  },
  canReadEvents: {
    control: 'boolean',
    description: 'Permission to read events',
    table: {
      category: 'AppContext',
    },
  },
  // Chrome controls
  environment: {
    control: 'select',
    options: ['prod', 'stage', 'ci-beta', 'ci-stable', 'qa-beta', 'qa-stable'],
    description: 'Environment for Chrome API',
    table: {
      category: 'Chrome',
    },
  },
} as const;
