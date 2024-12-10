import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export function setupLogging(app) {
  app.use((req, res, next) => {
    logger.info({
      method: req.method,
      path: req.path,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    next();
  });
}

export { logger };