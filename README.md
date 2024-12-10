# Security Training Lab - OWASP Top 10

A comprehensive security training environment for learning about OWASP Top 10 vulnerabilities through hands-on examples.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Test Accounts](#test-accounts)
- [Deployment](#deployment)
- [Security Notes](#security-notes)

## Features

- Interactive labs for all OWASP Top 10 vulnerabilities
- Real-world examples and scenarios
- Secure vs vulnerable implementations
- Comprehensive logging and monitoring
- Admin dashboard
- API documentation

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Modern web browser
- Git (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/security-training-lab.git
cd security-training-lab
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=3000
JWT_SECRET=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173
NODE_ENV=development
```

## Running the Application

1. Start the development servers:
```bash
npm run dev
```

This command starts:
- Frontend server: http://localhost:5173
- Main API server: http://localhost:3000
- Internal server: http://localhost:5000 (for SSRF testing)

## API Documentation

### Authentication

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "user": {
    "id": "number",
    "username": "string",
    "role": "string",
    "email": "string"
  }
}
```

#### Register
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "role": "string"
}
```

### Cryptography

#### Encrypt Data (Secure)
- **URL**: `/api/crypto/encrypt/secure`
- **Method**: `POST`
- **Body**:
```json
{
  "text": "string",
  "key": "string"
}
```

#### Store Password (Secure)
- **URL**: `/api/crypto/store-password/secure`
- **Method**: `POST`
- **Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

### SSRF Testing

#### Fetch URL (Secure)
- **URL**: `/api/ssrf/fetch/secure`
- **Method**: `GET`
- **Query**: `?url=string`
- **Auth**: Required

### Notes

#### Create Note (Secure)
- **URL**: `/api/notes/secure`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
```json
{
  "title": "string",
  "content": "string"
}
```

### Admin Endpoints

#### Get Users
- **URL**: `/api/admin/users`
- **Method**: `GET`
- **Auth**: Required (Admin)

#### Search Users
- **URL**: `/api/admin/users/search`
- **Method**: `GET`
- **Auth**: Required (Admin)
- **Query**: `?query=string`

## Test Accounts

The application comes with pre-configured test accounts:

1. Admin User
   - Username: `admin`
   - Password: `admin123`
   - Role: Administrator
   - Access: Full system access

2. Regular User
   - Username: `user`
   - Password: `user123`
   - Role: User
   - Access: Limited to user features

## Deployment

1. Build the application:
```bash
npm run build
```

2. Configure production environment:
```
NODE_ENV=production
JWT_SECRET=strong-random-secret
ALLOWED_ORIGINS=https://your-domain.com
```

3. Start production server:
```bash
npm start
```

### Production Security Checklist

1. Enable security headers:
   - HTTPS only
   - Strict Transport Security
   - Content Security Policy
   - XSS Protection

2. Configure rate limiting:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

3. Set secure cookie options:
```javascript
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

## Security Notes

This lab contains intentionally vulnerable code for educational purposes. Never use vulnerable implementations in production. Always:

1. Use secure configurations
2. Implement proper authentication
3. Validate all inputs
4. Use prepared statements for SQL
5. Implement proper access control
6. Use secure cryptographic methods
7. Enable security headers
8. Implement proper logging
9. Validate URLs and prevent SSRF
10. Keep dependencies updated

## License

MIT License - See LICENSE file for details