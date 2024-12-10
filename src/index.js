import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { setupDatabase } from './config/database.js';
import { setupLogging } from './config/logging.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import ssrfRoutes from './routes/ssrf.routes.js';
import notesRoutes from './routes/notes.routes.js';
import apiRoutes from './routes/api.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup logging
setupLogging(app);

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/api', apiRoutes);
app.use('/notes', notesRoutes);
app.use('/ssrf', ssrfRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
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