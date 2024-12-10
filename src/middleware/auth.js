import { verifyToken, getTokenFromRequest } from '../utils/auth.js';
import { logger } from '../config/logging.js';

export function authenticateToken(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}

export function checkRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (req.user.role !== role) {
      logger.warn(`Access denied: User ${req.user.id} attempted to access ${req.path}`);
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}