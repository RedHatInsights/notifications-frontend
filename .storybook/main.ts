import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';
import webpack from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/docs/*.mdx', '../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-docs',
    'msw-storybook-addon',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    defaultName: 'Documentation',
  },
  staticDirs: ['../static'],
  webpackFinal: async (config) => {
    // Mock hooks for Storybook - replace real implementations with our context-aware versions
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@redhat-cloud-services/frontend-components/useChrome': path.resolve(
          process.cwd(),
          '.storybook/hooks/useChrome'
        ),
        '@unleash/proxy-client-react': path.resolve(process.cwd(), '.storybook/hooks/unleash'),
        '@scalprum/react-core': path.resolve(process.cwd(), '.storybook/hooks/scalprum'),
      },
      fallback: {
        ...config.resolve?.fallback,
        buffer: require.resolve('buffer/'),
      },
    };

    // Add SCSS support
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Add SCSS rule
    config.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });

    // Provide Buffer globally for browser environments
    config.plugins = config.plugins || [];
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    return config;
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;
