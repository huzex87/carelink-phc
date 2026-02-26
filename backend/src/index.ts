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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware & Hardening
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);
app.use(auditLogger);

// Basic Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'CareLink PHC API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Layer 1 - EHR Routes
app.use('/api/v1/patients', patientsRouter);
app.use('/api/v1/encounters', encountersRouter);

// Layer 2/3 - Analytics Routes
app.use('/api/v1/analytics', analyticsRouter);

app.listen(PORT, () => {
  console.log(`🚀 CareLink PHC Server running on port ${PORT}`);
});

export default app;
