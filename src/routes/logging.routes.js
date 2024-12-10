import express from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../config/database.js';
import { logger } from '../config/logging.js';

const router = express.Router();

// Vulnerable login endpoint - minimal logging
router.post('/login/vulnerable', async (req, res) => {
  const { username, password } = req.body;
  const db = getDb();

  try {
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Secure login endpoint - comprehensive logging
router.post('/login/secure', async (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  const timestamp = new Date().toISOString();
  const clientIp = req.ip;

  try {
    // Log login attempt
    await db.run(
      'INSERT INTO audit_logs (action, details, ip_address) VALUES (?, ?, ?)',
      ['LOGIN_ATTEMPT', `Login attempt for user: ${username}`, clientIp]
    );

    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    
    if (!user) {
      await db.run(
        'INSERT INTO audit_logs (action, details, ip_address) VALUES (?, ?, ?)',
        ['LOGIN_FAILURE', `Invalid username: ${username}`, clientIp]
      );
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      await db.run(
        'INSERT INTO audit_logs (action, details, ip_address) VALUES (?, ?, ?)',
        ['LOGIN_FAILURE', `Invalid password for user: ${username}`, clientIp]
      );
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Log successful login
    await db.run(
      'INSERT INTO audit_logs (userId, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [user.id, 'LOGIN_SUCCESS', `User ${username} logged in successfully`, clientIp]
    );

    res.json({ message: 'Login successful' });
  } catch (error) {
    logger.error('Login error:', error);
    await db.run(
      'INSERT INTO audit_logs (action, details, ip_address) VALUES (?, ?, ?)',
      ['ERROR', `Login error: ${error.message}`, clientIp]
    );
    res.status(500).json({ error: 'Login failed' });
  }
});

// Fetch audit logs - vulnerable (no authentication)
router.get('/audit/vulnerable', async (req, res) => {
  const db = getDb();
  try {
    const logs = await db.all('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10');
    res.json(logs);
  } catch (error) {
    logger.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Fetch audit logs - secure (with authentication)
router.get('/audit/secure', async (req, res) => {
  const db = getDb();
  try {
    const logs = await db.all(
      'SELECT * FROM audit_logs WHERE action != "ERROR" ORDER BY created_at DESC LIMIT 10'
    );
    res.json(logs);
  } catch (error) {
    logger.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export default router;