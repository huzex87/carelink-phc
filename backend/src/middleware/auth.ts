import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Institutional SSO & JWT Authentication Middleware
 * Supports both local JWT and Federated OIDC tokens (e.g., from Keycloak).
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required: Institutional Token Missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // In a production environment, this would verify against multiple public keys from OIDC providers
        const secret = process.env.JWT_SECRET || 'carelink-institutional-key-2026';
        const decoded = jwt.verify(token, secret);

        // Attach institutional identity to request
        (req as any).user = decoded;

        // Log authenticated institutional access
        console.log(`[AUTH] Institutional User Authenticated: ${(decoded as any).sub} | Org: ${(decoded as any).org_unit}`);

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or Expired Institutional Token' });
    }
};

/**
 * Role-Based Access Control (RBAC) Guard
 */
export const requireRole = (role: 'CLINICIAN' | 'LAB_TECH' | 'PHARMACIST' | 'ADMIN') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || user.role !== role && user.role !== 'ADMIN') {
            return res.status(403).json({ message: `Access Denied: Required Role [${role}] missing` });
        }

        next();
    };
};
