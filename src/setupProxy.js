const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/majora-api',
    createProxyMiddleware({
      target: 'http://majora.iinti.cn',
      changeOrigin: true,
      pathRewrite: {
        "^/majora-api": "/majora-api"
      }
    })
  );
};
