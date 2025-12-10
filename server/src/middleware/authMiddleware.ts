import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

interface JwtPayload {
    userId: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, config.jwtSecret, (err: any, user: any) => {
        if (err) {
            console.error('[AuthMiddleware] Verify Error:', err.message);
            console.error('[AuthMiddleware] Token:', token);
            // console.error('[AuthMiddleware] Secret:', config.jwtSecret); // Be careful with secrets in prod logs
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log('[AuthMiddleware] User authenticated:', user);
        req.user = user as JwtPayload;
        next();
    });
};
