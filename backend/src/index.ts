import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { auditLogger } from './middleware/audit.js';
import patientsRouter from './routes/patients.js';
import encountersRouter from './routes/encounters.js';
import analyticsRouter from './routes/analytics.js';
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import { initCouchDB } from './config/couchdb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware & Hardening
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "http://localhost:5984"], // Allow CouchDB local sync
    },
  },
  crossOriginEmbedderPolicy: false,
}));

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://carelink-phc.vercel.app', 'https://carelink.jigawa.gov.ng']
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
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);
app.use(auditLogger);

// Keycloak Setup
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: process.env.SESSION_SECRET || 'carelink_secure_secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloak = new Keycloak({ store: memoryStore });
app.use(keycloak.middleware());

// Basic Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'CareLink PHC API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Layer 1 - EHR Routes (Requires basic authenticated access)
app.use('/api/v1/patients', keycloak.protect(), patientsRouter);
app.use('/api/v1/encounters', keycloak.protect(), encountersRouter);

// Layer 2/3 - Analytics Routes (Requires manager or admin role)
app.use('/api/v1/analytics', keycloak.protect('realm:manager'), analyticsRouter);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`🚀 CareLink PHC Server running on port ${PORT}`);
    await initCouchDB();
  });
}

export default app;
