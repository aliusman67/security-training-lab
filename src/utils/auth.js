import jwt from 'jsonwebtoken';
import { logger } from '../config/logging.js';

const TOKEN_EXPIRY = '15m'; // 15 minutes session timeout

export function generateToken(user) {
  try {
    return jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
  } catch (error) {
    logger.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error('Token verification error:', error);
    return null;
  }
}

export function getTokenFromRequest(req) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    return token;
  } catch (error) {
    logger.error('Token extraction error:', error);
    return null;
  }
}