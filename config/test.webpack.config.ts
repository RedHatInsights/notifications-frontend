import config from '@redhat-cloud-services/frontend-components-config';
import { resolve } from 'path';

import { updateTsLoaderRule } from './TsLoaderCustomTransformers';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../')
});

// Upgrade module.rules to include transformers rules
updateTsLoaderRule(webpackConfig.module.rules);

module.exports = {
    ...webpackConfig,
    plugins
};
