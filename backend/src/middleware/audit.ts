import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Centralized Audit Middleware
 * Logs every meaningful clinical data touchpoint for accountability.
 */
export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const originalSend = res.send;

    let payloadHash = undefined;
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        payloadHash = crypto.createHash('sha256').update(JSON.stringify(req.body || {})).digest('hex');
    }

    res.send = function (body) {
        const duration = Date.now() - start;
        const auditEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            userAgent: req.get('user-agent'),
            payloadHash: payloadHash,
            // Extract subject identifier from Keycloak token if authenticated
            user: (req as any).kauth?.grant?.access_token?.content?.sub || 'anonymous'
        };

        // Output structured JSON for SIEM ingestion
        if (req.method !== 'GET' || res.statusCode >= 400) {
            console.log(`[SIEM-AUDIT] ${JSON.stringify(auditEntry)}`);
        }

        return originalSend.apply(res, arguments as any);
    };

    next();
};
