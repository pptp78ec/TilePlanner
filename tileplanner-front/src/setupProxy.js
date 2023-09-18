const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // Замените '/api' на URL вашего сервера, если необходимо
    createProxyMiddleware({
      target: 'https://localhost:7029',
      changeOrigin: true,
    })
  );
};