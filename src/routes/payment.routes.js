import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { getDb } from '../config/database.js';
import { logger } from '../config/logging.js';

const router = express.Router();

// Vulnerable: No input validation or rate limiting
router.post('/process/vulnerable', async (req, res) => {
  const { amount, cardNumber, cvv } = req.body;
  const db = getDb();
  
  try {
    // Vulnerable: No validation, storing sensitive data in plain text
    const result = await db.run(
      'INSERT INTO payments (amount, card_number, status) VALUES (?, ?, ?)',
      [amount, cardNumber, 'completed']
    );
    res.json({ id: result.lastID, status: 'success' });
  } catch (error) {
    logger.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

// Secure: Proper validation and security measures
router.post('/process', [
  authenticateToken,
  body('amount').isFloat({ min: 0.01 }),
  body('cardNumber').isCreditCard(),
  body('cvv').isLength({ min: 3, max: 4 }).isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { amount, cardNumber } = req.body;
  const db = getDb();
  
  try {
    // Store only last 4 digits of card number
    const lastFour = cardNumber.slice(-4);
    const result = await db.run(
      'INSERT INTO payments (userId, amount, card_number, status) VALUES (?, ?, ?, ?)',
      [req.user.id, amount, `****-****-****-${lastFour}`, 'completed']
    );

    // Log the payment
    await db.run(
      'INSERT INTO audit_logs (userId, action, details) VALUES (?, ?, ?)',
      [req.user.id, 'PAYMENT', `Payment processed for $${amount}`]
    );

    res.json({ id: result.lastID, status: 'success' });
  } catch (error) {
    logger.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

export default router;