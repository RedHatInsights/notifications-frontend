import config from '@redhat-cloud-services/frontend-components-config';
import federatedModules from '@redhat-cloud-services/frontend-components-config/federated-modules';
import { resolve } from 'path';

import { updateTsLoaderRule } from './common.webpack.config';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    useFileHash: false,
    useProxy: true,
    deployment: process.env.BETA ? 'beta/apps' : 'apps',
    appUrl: process.env.BETA ? '/beta/settings/notifications' : '/settings/notifications',
    env: process.env.BETA ? 'stage-beta' : 'stage-stable',
    port: 8003
});

webpackConfig.devtool = 'eval-cheap-module-source-map';

plugins.push(
    federatedModules(
        {
            root: resolve(__dirname, '../'),
            debug: true,
            useFileHash: false,
            exclude: [ 'react-router-dom' ]
        }
    )
);

updateTsLoaderRule(webpackConfig.module.rules);

module.exports = {
    ...webpackConfig,
    plugins
};
