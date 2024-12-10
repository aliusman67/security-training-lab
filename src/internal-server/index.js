import express from 'express';
import { getDb } from '../config/database.js';

const app = express();
const INTERNAL_PORT = 5000;

// Middleware to check if request is from localhost
const internalOnly = (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  if (clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.includes('::ffff:127.0.0.1')) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Internal server.' });
  }
};

// Internal API endpoints
app.get('/internal/system/info', internalOnly, (req, res) => {
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

app.get('/internal/users/all', internalOnly, async (req, res) => {
  const db = getDb();
  try {
    const users = await db.all('SELECT * FROM users');
    res.json({
      message: 'Internal admin access',
      sensitiveData: {
        users,
        apiKeys: users.map(user => user.api_key),
        passwords: users.map(user => user.password)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/internal/config', internalOnly, (req, res) => {
  res.json({
    databaseConfig: {
      host: 'internal-db.local',
      user: 'admin',
      password: 'super-secret-db-password-123',
      database: 'security_lab'
    },
    apiKeys: {
      stripe: 'sk_live_123456789abcdefghijklmnop',
      aws: 'AKIA1234567890ABCDEFGH',
      github: 'ghp_abcdefghijklmnopqrstuvwxyz123456',
      sendgrid: 'SG.1234567890.abcdefghijklmnopqrstuvwxyz',
      twilioAuthToken: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
    },
    internalServices: {
      monitoring: 'http://monitor.internal:9090',
      metrics: 'http://metrics.internal:9091',
      admin: 'http://admin.internal:5000',
      redis: 'redis://cache.internal:6379',
      elasticsearch: 'http://search.internal:9200'
    },
    security: {
      jwtSecret: 'your-super-secret-jwt-token-key-123',
      encryptionKey: '0123456789abcdef0123456789abcdef',
      adminCredentials: {
        username: 'superadmin',
        password: 'Admin123!@#'
      }
    },
    backupServers: [
      'backup1.internal:22',
      'backup2.internal:22',
      'backup3.internal:22'
    ],
    vpnConfig: {
      server: 'vpn.internal',
      port: 1194,
      credentials: {
        username: 'vpn_admin',
        password: 'VpnPass123!'
      }
    }
  });
});

app.listen(INTERNAL_PORT, '127.0.0.1', () => {
  console.log(`Internal admin server running at http://localhost:${INTERNAL_PORT}`);
});