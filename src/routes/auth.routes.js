import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { getDb } from '../config/database.js';
import { logger } from '../config/logging.js';
import { generateToken } from '../utils/auth.js';
import { validatePassword } from '../utils/validation.js';

const router = express.Router();

// User login
router.post('/login', [
  body('username').trim().notEmpty(),
  body('password').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const db = getDb();

  try {
    const user = await db.get(
      'SELECT * FROM users WHERE username = ? AND role = ?', 
      [username, 'user']
    );
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    // Log successful login
    await db.run(
      'INSERT INTO audit_logs (userId, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [user.id, 'LOGIN', 'User login successful', req.ip]
    );

    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email
      },
      token
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin login
router.post('/admin/login', [
  body('username').trim().notEmpty(),
  body('password').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const db = getDb();

  try {
    const admin = await db.get(
      'SELECT * FROM users WHERE username = ? AND role = ?', 
      [username, 'admin']
    );
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = generateToken(admin);

    // Log successful admin login
    await db.run(
      'INSERT INTO audit_logs (userId, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [admin.id, 'ADMIN_LOGIN', 'Admin login successful', req.ip]
    );

    res.json({
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        email: admin.email
      },
      token
    });
  } catch (error) {
    logger.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// Register route (user only)
router.post('/register', [
  body('username').trim().isLength({ min: 3 }),
  body('password').isLength({ min: 6 }),
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email } = req.body;
  const db = getDb();

  try {
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Check if username exists
    const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with 'user' role only
    const result = await db.run(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, 'user']
    );

    // Log registration
    await db.run(
      'INSERT INTO audit_logs (userId, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [result.lastID, 'REGISTER', 'New user registration', req.ip]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;