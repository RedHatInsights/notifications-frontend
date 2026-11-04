import { createMainConfig } from '@redhat-cloud-services/hcc-storybook-hub/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import remarkGfm from 'remark-gfm';

// Hub 0.3+ defaults to the Vite framework (Storybook 10) and applies the
// Chrome/RBACHook/Unleash/Kessel mock aliases via viteFinal. Kessel user
// journeys drive the hub mock via MockState (orgOptedIn, tenantPermissions)
// — see src/components/Notifications/Form/RecipientTypeahead.stories.tsx.
const config = createMainConfig({
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../static'],
  remarkPlugins: [remarkGfm],
});

// The webpack-era config provided Buffer via ProvidePlugin; Vite ships no
// node globals. react-fetching-library references the Buffer global when
// serializing request actions.
const hubViteFinal = config.viteFinal;
config.viteFinal = async (viteConfig) => {
  const cfg = await hubViteFinal?.(viteConfig);
  cfg.plugins = [
    ...(cfg.plugins ?? []),
    nodePolyfills({ include: ['buffer'], globals: { Buffer: true } }),
  ];
  return cfg;
};

export default config;
