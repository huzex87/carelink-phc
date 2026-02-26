import type { Request, Response, NextFunction } from 'express';

/**
 * Centralized Audit Middleware
 * Logs every meaningful clinical data touchpoint for accountability.
 */
export const auditLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Capture the original send to intercept the response status
    const originalSend = res.send;

    res.send = function (body) {
        const duration = Date.now() - start;
        const auditEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            // In a real system, we'd extract the user ID from the JWT here
            user: 'SuperAdmin-PHC-001'
        };

        // Log to console for visibility during dev
        // In production, this would go to a secure AuditLog table or external ELK stack
        if (req.method !== 'GET' || res.statusCode >= 400) {
            console.log(`[AUDIT] ${JSON.stringify(auditEntry)}`);
        }

        return originalSend.apply(res, arguments as any);
    };

    next();
};
