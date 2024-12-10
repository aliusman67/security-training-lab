import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import { logger } from './logging.js';

let db;

async function initializeTables() {
  try {
    await db.exec(`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user',
        email TEXT,
        api_key TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Stored passwords for crypto lab
      CREATE TABLE IF NOT EXISTS stored_passwords (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        hash_method TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Encrypted data for crypto lab
      CREATE TABLE IF NOT EXISTS encrypted_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT,
        encryption_method TEXT,
        iv TEXT,
        auth_tag TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Payments table for Insecure Design lab
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        amount DECIMAL,
        status TEXT,
        card_number TEXT,
        cvv TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      -- Notes table for XSS and CSRF labs
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        title TEXT,
        content TEXT,
        is_private BOOLEAN,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      -- Audit logs for Security Logging lab
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        action TEXT,
        details TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      -- Security events for Logging lab
      CREATE TABLE IF NOT EXISTS security_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        event_type TEXT,
        description TEXT,
        severity TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      -- API keys for Security Misconfig lab
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        key_value TEXT UNIQUE,
        is_active BOOLEAN DEFAULT true,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      -- Session tokens for Auth Failures lab
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        token TEXT UNIQUE,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      );
    `);

    logger.info('Database tables created successfully');
    return true;
  } catch (error) {
    logger.error('Error creating database tables:', error);
    return false;
  }
}

async function createDummyAccounts() {
  try {
    // Create admin account
    const adminPassword = await bcrypt.hash('admin123', 10);
    await db.run(`
      INSERT OR IGNORE INTO users (username, password, role, email, api_key) 
      VALUES ('admin', ?, 'admin', 'admin@example.com', 'admin-api-key-123')
    `, [adminPassword]);

    // Create regular user account
    const userPassword = await bcrypt.hash('user123', 10);
    await db.run(`
      INSERT OR IGNORE INTO users (username, password, role, email, api_key) 
      VALUES ('user', ?, 'user', 'user@example.com', 'user-api-key-456')
    `, [userPassword]);

    // Insert some initial encrypted data
    await db.run(`
      INSERT OR IGNORE INTO encrypted_data (data, encryption_method, iv, auth_tag)
      VALUES 
        ('SGVsbG8gV29ybGQ=', 'base64', NULL, NULL),
        ('7b9f6b0d5f3b2a1c', 'aes-256-gcm', 'a1b2c3d4e5f6', 'f6e5d4c3b2a1')
    `);

    logger.info('Dummy accounts and data created successfully');
  } catch (error) {
    logger.error('Error creating dummy data:', error);
  }
}

export async function setupDatabase() {
  try {
    db = await open({
      filename: ':memory:',
      driver: sqlite3.Database
    });

    const tablesCreated = await initializeTables();
    if (tablesCreated) {
      await createDummyAccounts();
    }

    return db;
  } catch (error) {
    logger.error('Database setup error:', error);
    throw error;
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}