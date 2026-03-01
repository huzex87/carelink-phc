import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import swaggerUi from 'swagger-ui-express';
import promBundle from 'express-prom-bundle';

import { env } from './config/env.js';
import logger from './config/logger.js';
import { auditLogger } from './middleware/audit.js';
import patientsRouter from './routes/patients.js';
import encountersRouter from './routes/encounters.js';
import analyticsRouter from './routes/analytics.js';
import { initCouchDB } from './config/couchdb.js';
import swaggerSpecs from './config/swagger.js';
import sequelize from './config/database.js';

const app = express();
const PORT = env.PORT;

// 1. Prometheus Metrics (Observability Layer 4)
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  normalizePath: [
    ['^/api/v1/patients/.*', '/api/v1/patients/#id'],
    ['^/api/v1/encounters/.*', '/api/v1/encounters/#id'],
  ],
  promClient: {
    collectDefaultMetrics: {}
  }
});
app.use(metricsMiddleware);

// Middleware & Hardening
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", env.COUCHDB_URL], // Use env config
    },
  },
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = env.NODE_ENV === 'production'
  ? ['https://carelink-phc.vercel.app', 'https://carelink.katsina.gov.ng']
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Use structured logger format for morgan in non-dev
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);
app.use(auditLogger);

// Keycloak Setup
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = new Keycloak({ store: memoryStore });
app.use(keycloak.middleware());

// API Documentation (Swagger)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Enhanced Health Check
/**
 * @openapi
 * /health:
 *   get:
 *     description: Returns the health status of the API and its dependencies.
 *     responses:
 *       200:
 *         description: All systems online.
 */
app.get('/health', async (req: Request, res: Response) => {
  let dbStatus = 'online';
  try {
    await sequelize.authenticate();
  } catch (error) {
    dbStatus = 'offline';
    logger.error(`[HEALTH] Database Connection Failed: ${error}`);
  }

  res.json({
    status: dbStatus === 'online' ? 'online' : 'degraded',
    system: 'CareLink PHC API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    checks: {
      database: dbStatus,
      node_env: env.NODE_ENV
    }
  });
});

// Layer 1 - EHR Routes
app.use('/api/v1/patients', keycloak.protect(), patientsRouter);
app.use('/api/v1/encounters', keycloak.protect(), encountersRouter);

// Layer 2/3 - Analytics Routes
app.use('/api/v1/analytics', keycloak.protect('realm:manager'), analyticsRouter);

if (env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    logger.info(`🚀 CareLink PHC Server running on port ${PORT}`);
    logger.info(`📄 API Docs available at http://localhost:${PORT}/api-docs`);
    await initCouchDB();
  });
}

export default app;
