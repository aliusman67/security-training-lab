import crypto from 'crypto';

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}