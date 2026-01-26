export default () => ({
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    environment: process.env.NODE_ENV || 'development',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '30000', 10),
    limit: parseInt(process.env.RATE_LIMIT_MAX || '333', 10),
  },
  cookies: {
    maxAge: parseInt(process.env.COOKIE_MAX_AGE || '2592000000', 10), // 30 дней
    httpOnly: true,
  },
});
