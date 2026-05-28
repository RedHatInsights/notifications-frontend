import { createMainConfig } from '@redhat-cloud-services/hcc-storybook-hub/main-config';
import webpack from 'webpack';

export default createMainConfig({
  stories: [
    '../src/docs/*.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  staticDirs: ['../static'],
  webpackFallback: {
    buffer: require.resolve('buffer/'),
  },
  webpackPlugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
});
