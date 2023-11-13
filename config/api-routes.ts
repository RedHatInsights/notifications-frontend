const API_PORT = 8085;

export const apiRoutes = {
  '/api/integrations/': { host: `http://localhost:${API_PORT}` },
  '/api/notifications/': { host: `http://localhost:${API_PORT}` },
};
