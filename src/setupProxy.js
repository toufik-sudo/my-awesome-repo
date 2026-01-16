const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/v4',
    createProxyMiddleware({
      target: 'https://api.huuray.com',
      changeOrigin: true,
    })
  );

  app.use(
    '/ia_upload_knowledge',
    createProxyMiddleware({
      target: process.env.REACT_APP_RAG_URL,
      changeOrigin: true,
    })
  );

  app.use(
    '/index_link',
    createProxyMiddleware({
      target: process.env.REACT_APP_RAG_URL,
      changeOrigin: true,
    })
  );

  app.use(
    '/get_audio_tts',
    createProxyMiddleware({
      target: process.env.REACT_APP_RAG_URL,
      changeOrigin: true,
    })
  );

  app.use(
    '/delete-namespace',
    createProxyMiddleware({
      target: process.env.REACT_APP_RAG_URL,
      changeOrigin: true,
    })
  );

  app.use(
    '/send_email',
    createProxyMiddleware({
      target: process.env.REACT_APP_RAG_URL,
      changeOrigin: true,
    })
  );

  app.use(
    '/get_tokens_count',
    createProxyMiddleware({
      target: process.env.REACT_APP_RAG_URL,
      changeOrigin: true,
    })
  );

  app.use(
    '/get_file_tokens_count',
    createProxyMiddleware({
      target: process.env.REACT_APP_RAG_URL,
      changeOrigin: true,
    })
  );

  app.use(
    '/tts',
    createProxyMiddleware({
      target: "http://37.187.136.84:5005/api",
      changeOrigin: true,
    })
  );

  app.use(
    '/api/tts_dual_workers_fixed',
    createProxyMiddleware({
      target: "http://37.187.136.84:5005",
      changeOrigin: true,
    })
  );

  app.use(
    '/checkout-stripe-api',
    createProxyMiddleware({
      target: process.env.REACT_APP_BACKEND_HOST_URL + "checkout.php",
      changeOrigin: true,
    })
  );

  app.use(
    '/status-stripe-api',
    createProxyMiddleware({
      target: process.env.REACT_APP_BACKEND_HOST_URL + "status.php",
      changeOrigin: true,
    })
  );

  app.use(
    '/cr-dev-user-profile-images',
    createProxyMiddleware({
      target: 'https://s3.eu-central-1.amazonaws.com',
      changeOrigin: true,
    })
  );
};