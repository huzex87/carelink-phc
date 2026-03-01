import { cleanEnv, str, port, host } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
    PORT: port({ default: 3001 }),
    DB_HOST: host({ default: 'localhost' }),
    DB_NAME: str({ default: 'carelink_phc' }),
    DB_USER: str({ default: 'postgres' }),
    DB_PASS: str({ default: 'postgres' }),
    JWT_SECRET: str(),
    SESSION_SECRET: str({ default: 'carelink_secure_session_2026' }),
    COUCHDB_URL: str({ default: 'http://localhost:5984' })
});
