export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOptions: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};