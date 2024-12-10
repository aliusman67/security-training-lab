import express from 'express';
import { body } from 'express-validator';
import { getDb } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { logger } from '../config/logging.js';
import DOMPurify from 'dompurify';

const router = express.Router();

// Vulnerable: XSS through note content
router.post('/vulnerable', async (req, res) => {
  const { title, content } = req.body;
  const db = getDb();

  try {
    // Vulnerable: No input sanitization
    const result = await db.run(
      'INSERT INTO notes (title, content, userId, is_private) VALUES (?, ?, ?, ?)',
      [title, content, 1, false]
    );

    // Log the note creation
    await db.run(
      'INSERT INTO audit_logs (userId, action, details) VALUES (?, ?, ?)',
      [1, 'NOTE_CREATED', `Note created with title: ${title}`]
    );

    res.json({ 
      id: result.lastID,
      message: 'Note created successfully',
      note: { title, content }
    });
  } catch (error) {
    logger.error('Note creation error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Secure note creation
router.post('/secure', [
  authenticateToken,
  body('title').trim().escape(),
  body('content').trim()
], async (req, res) => {
  const { title, content } = req.body;
  const db = getDb();

  try {
    // Sanitize content
    const sanitizedContent = DOMPurify.sanitize(content);

    const result = await db.run(
      'INSERT INTO notes (title, content, userId, is_private) VALUES (?, ?, ?, ?)',
      [title, sanitizedContent, req.user.id, true]
    );

    // Log the secure note creation
    await db.run(
      'INSERT INTO audit_logs (userId, action, details) VALUES (?, ?, ?)',
      [req.user.id, 'NOTE_CREATED_SECURE', `Secure note created with title: ${title}`]
    );

    res.json({ 
      id: result.lastID,
      message: 'Note created successfully',
      note: { title, content: sanitizedContent }
    });
  } catch (error) {
    logger.error('Note creation error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

export default router;