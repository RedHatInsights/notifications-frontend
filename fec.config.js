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
    _unstableHotReload: process.env.HOT === 'true'
};
