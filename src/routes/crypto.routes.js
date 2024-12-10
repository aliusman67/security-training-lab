import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getDb } from '../config/database.js';
import { logger } from '../config/logging.js';
import { encryptAES, generateSecureKey } from '../utils/crypto.js';

const router = express.Router();

// Vulnerable password storage (MD5)
router.post('/store-password/vulnerable', async (req, res) => {
  const { username, password } = req.body;
  const db = getDb();

  try {
    // Vulnerable: Using MD5 hash
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    
    await db.run(
      'INSERT INTO stored_passwords (username, password, hash_method) VALUES (?, ?, ?)',
      [username, hashedPassword, 'md5']
    );

    res.json({
      message: 'Password stored with MD5 hash',
      stored: {
        username,
        hashedPassword,
        hashMethod: 'MD5'
      }
    });
  } catch (error) {
    logger.error('Password storage error:', error);
    res.status(500).json({ error: 'Failed to store password' });
  }
});

// Secure password storage (bcrypt)
router.post('/store-password/secure', async (req, res) => {
  const { username, password } = req.body;
  const db = getDb();

  try {
    // Secure: Using bcrypt with salt
    const hashedPassword = await bcrypt.hash(password, 12);
    
    await db.run(
      'INSERT INTO stored_passwords (username, password, hash_method) VALUES (?, ?, ?)',
      [username, hashedPassword, 'bcrypt']
    );

    res.json({
      message: 'Password stored securely with bcrypt',
      stored: {
        username,
        hashMethod: 'bcrypt',
        saltRounds: 12
      }
    });
  } catch (error) {
    logger.error('Password storage error:', error);
    res.status(500).json({ error: 'Failed to store password' });
  }
});

// Vulnerable encryption (Base64)
router.post('/encrypt/vulnerable', async (req, res) => {
  const { text } = req.body;
  const db = getDb();

  try {
    // Vulnerable: Using Base64 encoding (not encryption)
    const encoded = Buffer.from(text).toString('base64');
    
    await db.run(
      'INSERT INTO encrypted_data (data, encryption_method) VALUES (?, ?)',
      [encoded, 'base64']
    );

    res.json({
      message: 'Data "encrypted" with Base64 encoding',
      encrypted: encoded,
      method: 'Base64'
    });
  } catch (error) {
    logger.error('Encryption error:', error);
    res.status(500).json({ error: 'Encryption failed' });
  }
});

// Secure encryption (AES-256-GCM)
router.post('/encrypt/secure', async (req, res) => {
  const { text } = req.body;
  const db = getDb();

  try {
    const key = generateSecureKey();
    const { encrypted, iv, authTag } = encryptAES(text, key);

    await db.run(
      'INSERT INTO encrypted_data (data, encryption_method, iv, auth_tag) VALUES (?, ?, ?, ?)',
      [encrypted, 'aes-256-gcm', iv, authTag]
    );

    res.json({
      message: 'Data encrypted securely with AES-256-GCM',
      encrypted,
      iv,
      authTag,
      method: 'AES-256-GCM'
    });
  } catch (error) {
    logger.error('Encryption error:', error);
    res.status(500).json({ error: 'Encryption failed' });
  }
});

export default router;