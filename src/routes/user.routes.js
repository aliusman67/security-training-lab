import express from 'express';
import { body } from 'express-validator';
import { getDb } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { logger } from '../config/logging.js';

const router = express.Router();

// Vulnerable user data endpoint (Insecure Direct Object References)
router.get('/profile/vulnerable/:id', async (req, res) => {
  const db = getDb();
  
  try {
    // VULNERABLE: No authentication check
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json(user);
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Secure user data endpoint
router.get('/profile/secure/:id', authenticateToken, async (req, res) => {
  const db = getDb();
  
  try {
    // Secure: Checking if the requesting user has access to this profile
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const user = await db.get('SELECT id, username, role FROM users WHERE id = ?', [req.params.id]);
    res.json(user);
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;