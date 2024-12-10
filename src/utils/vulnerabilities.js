// Utility functions to demonstrate various vulnerabilities

export function generateWeakToken() {
  // Vulnerable: Predictable token generation
  const timestamp = Date.now();
  return Buffer.from(`token_${timestamp}`).toString('base64');
}

export function validateUrlVulnerable(url) {
  // Vulnerable: Weak URL validation
  return url.startsWith('http');
}

export function encryptWeakly(text) {
  // Vulnerable: Weak encryption
  return Buffer.from(text).toString('base64');
}

export function decryptWeakly(text) {
  // Vulnerable: Weak decryption
  return Buffer.from(text, 'base64').toString('ascii');
}

export function sanitizeHtmlVulnerable(html) {
  // Vulnerable: Insufficient HTML sanitization
  return html.replace(/<script>/gi, '');
}

export function validateInputVulnerable(input) {
  // Vulnerable: Weak input validation
  return input.length > 0;
}