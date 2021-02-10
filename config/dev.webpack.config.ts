import config from '@redhat-cloud-services/frontend-components-config';
import { resolve } from 'path';

import { updateTsLoaderRule } from './TsLoaderCustomTransformers';
// import * as webpack from 'webpack';
// import ProfilingPlugin = webpack.debug.ProfilingPlugin;
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true,
    useFileHash: false
});

// Upgrade module.rules to include transformers rules
updateTsLoaderRule(webpackConfig.module.rules);

webpackConfig.devtool = 'eval-cheap-module-source-map';
// Used for profiling the build, generates an event.js that can be loaded in google chrome performance tab
// plugins.push(new ProfilingPlugin());
// Checks final bundle sizes and what elements are generated
// plugins.push(new BundleAnalyzerPlugin());

module.exports = {
    ...webpackConfig,
    plugins
};
