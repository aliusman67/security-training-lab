import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { setupDatabase } from '../config/database.js';
import { setupLogging } from '../config/logging.js';
import authRoutes from '../routes/auth.routes.js';
import adminRoutes from '../routes/admin.routes.js';
import userRoutes from '../routes/user.routes.js';
import paymentRoutes from '../routes/payment.routes.js';
import ssrfRoutes from '../routes/ssrf.routes.js';
import notesRoutes from '../routes/notes.routes.js';
import apiRoutes from '../routes/api.routes.js';
import cryptoRoutes from '../routes/crypto.routes.js';
import loggingRoutes from '../routes/logging.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api', limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup logging
setupLogging(app);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ssrf', ssrfRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/logging', loggingRoutes);
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Server error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database and start server
setupDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Test credentials:');
    console.log('Admin - username: admin, password: admin123');
    console.log('User - username: user, password: user123');
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});