const path = require('path');

module.exports = {
    appUrl: [ '/settings/notifications', 'settings/integrations' ],
    debug: true,
    useProxy: true,
    proxyVerbose: true,
    /**
     * Change to false after your app is registered in configuration files
     */
    interceptChromeConfig: false,
    /**
     * Add additional webpack plugins
     */
    plugins: [],
    _unstableHotReload: process.env.HOT === 'true',
    routes: {
        ...(process.env.CONFIG_PORT && {
            '/api/chrome-service/v1/static': {
                host: `http://localhost:${process.env.CONFIG_PORT}`
            }
        })
    },
    moduleFederation: {
        exposes: {
            './RootApp': path.resolve(__dirname, './src/AppEntry.tsx'),
            './IntegrationsTable': path.resolve(__dirname, './src/IntegrationsEntry.tsx'),
            './TimeConfig': path.resolve(__dirname, './src/components/Notifications/TimeConfig.tsx')
        },
        shared: [
            {
                'react-router-dom': { singleton: true, requiredVersion: '*' }
            }
        ]
    }
};
