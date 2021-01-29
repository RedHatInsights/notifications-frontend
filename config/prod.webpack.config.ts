import config from '@redhat-cloud-services/frontend-components-config';
import federated from '@redhat-cloud-services/frontend-components-config/federated-modules';
import { resolve } from 'path';

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../')
});

plugins.push(
    federated({
        root: resolve(__dirname, '../')
    })
);

module.exports = {
    ...webpackConfig,
    plugins
};
