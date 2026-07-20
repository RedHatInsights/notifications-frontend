import { createMainConfig } from '@redhat-cloud-services/hcc-storybook-hub/config';
import webpack from 'webpack';

export default createMainConfig({
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
