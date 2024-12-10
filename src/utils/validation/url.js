import { URL } from 'url';

export const ALLOWED_DOMAINS = [
  'api.example.com',
  'api.trusted-domain.com',
  'jsonplaceholder.typicode.com',
  'api.github.com'
];

export const BLOCKED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '[::1]',
  'internal-server.local',
  'internal-admin.local',
  'monitor.internal',
  'metrics.internal',
  'admin.internal',
  'cache.internal',
  'search.internal',
  'backup1.internal',
  'backup2.internal',
  'backup3.internal',
  'vpn.internal'
];

export function validateUrl(url) {
  try {
    const parsedUrl = new URL(url);
    
    if (BLOCKED_DOMAINS.some(domain => 
      parsedUrl.hostname === domain || 
      parsedUrl.hostname.includes(domain) ||
      parsedUrl.hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/)
    )) {
      return {
        valid: false,
        error: 'Internal addresses and IP addresses are not allowed'
      };
    }

    if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
      return {
        valid: false,
        error: 'Domain not in allowed list'
      };
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return {
        valid: false,
        error: 'Only HTTP and HTTPS protocols are allowed'
      };
    }

    return {
      valid: true,
      url: parsedUrl.toString()
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid URL format'
    };
  }
}