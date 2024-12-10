import crypto from 'crypto';

export function generateSecureKey(length = 32) {
  return crypto.randomBytes(length);
}

export function encryptAES(text, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

export function decryptAES(encrypted, key, iv, authTag) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}