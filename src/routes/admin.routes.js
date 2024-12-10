import express from 'express';
import { authenticateToken, checkRole } from '../middleware/auth.js';
import { getDb } from '../config/database.js';
import { logger } from '../config/logging.js';

const router = express.Router();

// Vulnerable: No authentication or authorization
router.get('/users/vulnerable', async (req, res) => {
  const db = getDb();
  try {
    const users = await db.all('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    logger.error('User fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Secure: Proper authentication and authorization
router.get('/users', authenticateToken, checkRole('admin'), async (req, res) => {
  const db = getDb();
  try {
    const users = await db.all('SELECT id, username, role, created_at FROM users');
    res.json(users);
  } catch (error) {
    logger.error('User fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Vulnerable: SQL Injection with detailed error messages
router.get('/users/search/vulnerable', async (req, res) => {
  const { query } = req.query;
  const db = getDb();
  
  try {
    // Vulnerable: Direct string concatenation
    const sqlQuery = `SELECT * FROM users WHERE username LIKE '%${query}%'`;
    const users = await db.all(sqlQuery);
    res.json(users);
  } catch (error) {
    logger.error('SQL Injection error:', error);
    
    // Extract useful information from the error
    const errorInfo = {
      error: 'Search failed',
      sqlError: error.message,
      query: `SELECT * FROM users WHERE username LIKE '%${query}%'`,
      details: {
        code: error.code,
        errno: error.errno,
        syntax: error.message.includes('syntax') ? 'SQL syntax error detected' : null,
        specialChars: /['"\\;]/.test(query) ? 'Special characters detected in query' : null
      }
    };

    res.status(500).json(errorInfo);
  }
});

// Secure: Parameterized query
router.get('/users/search', authenticateToken, checkRole('admin'), async (req, res) => {
  const { query } = req.query;
  const db = getDb();
  try {
    const users = await db.all(
      'SELECT id, username, role FROM users WHERE username LIKE ?', 
      [`%${query}%`]
    );
    res.json(users);
  } catch (error) {
    logger.error('User search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, checkRole('admin'), async (req, res) => {
  const { id } = req.params;
  const db = getDb();
  try {
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('User deletion error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Audit Logs
router.get('/audit-logs', authenticateToken, checkRole('admin'), async (req, res) => {
  const db = getDb();
  try {
    const logs = await db.all('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
    res.json(logs);
  } catch (error) {
    logger.error('Audit log fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export default router;