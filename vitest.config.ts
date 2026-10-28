import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Storybook-project-only vitest setup; unit tests stay on jest.
// See https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            tags: { exclude: ['skip-test'] },
          }),
        ],
        test: {
          name: 'storybook',
          setupFiles: ['./.storybook/vitest.setup.ts'],
          testTimeout: 60_000,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            viewport: { width: 1200, height: 500 },
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
