import express from 'express';
import { getDb } from '../config/database.js';
import { generateWeakToken, validateUrlVulnerable } from '../utils/vulnerabilities.js';
import { logger } from '../config/logging.js';

const router = express.Router();

// Vulnerable: API Key exposure
router.get('/keys/vulnerable', async (req, res) => {
  const db = getDb();
  try {
    const users = await db.all('SELECT id, username, api_key FROM users');
    res.json(users);
  } catch (error) {
    logger.error('API key fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

// Vulnerable: Information exposure
router.get('/debug/vulnerable', (req, res) => {
  res.json({
    environment: process.env,
    serverInfo: {
      platform: process.platform,
      version: process.version,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  });
});

// Vulnerable: Path traversal
router.get('/files/vulnerable', (req, res) => {
  const { path } = req.query;
  // Vulnerable: Direct use of user input in file path
  res.sendFile(path);
});

export default router;