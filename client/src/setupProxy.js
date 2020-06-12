const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware("/api", { 
       target: "http://39.105.81.9:8090" ,
       secure: false,
       changeOrigin: true,
       pathRewrite: {
        "^/api": "/"
       },
    }));
};