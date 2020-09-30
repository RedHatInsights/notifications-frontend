// eslint-disable-next-line @typescript-eslint/no-var-requires
const goodGuyLib = require('good-guy-http');
const SECTION = 'settings';
const APP_ID = 'notifications';
const APP_MOUNTS = [ 'notifications', 'integrations' ];
const FRONTEND_PORT = 8002;
const API_PORT = 8085;
const routes = {};

APP_MOUNTS.forEach(mount => {
    routes[`/beta/${SECTION}/${mount}`] = { host: `https://localhost:${FRONTEND_PORT}` };
    routes[`/${SECTION}/${mount}`]      = { host: `https://localhost:${FRONTEND_PORT}` };
    routes[`/beta/apps/${mount}`]       = { host: `https://localhost:${FRONTEND_PORT}` };
    routes[`/apps/${mount}`]            = { host: `https://localhost:${FRONTEND_PORT}` };
});

routes[`/api/${APP_ID}/`] = { host: `http://localhost:${API_PORT}` };

module.exports = {
    routes,
    esi: {
        // Increases the default (2s) timeout which can be a pain sometimes.
        // https://github.com/Schibsted-Tech-Polska/good-guy-http/blob/master/lib/index.js#L55
        httpClient: goodGuyLib({
            timeout: 50000
        })
    }
};
