import config from '@redhat-cloud-services/frontend-components-config';
import federated from '@redhat-cloud-services/frontend-components-config/federated-modules';
import { resolve } from 'path';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true,
    useFileHash: false
});

console.log(webpackConfig.mode);

plugins.push(
    federated({
        root: resolve(__dirname, '../'),
        useFileHash: false
    })
);

module.exports = {
    ...webpackConfig,
    plugins
};
