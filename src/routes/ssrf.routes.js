import express from 'express';
import { fetchUrl } from '../utils/http-client.js';
import { validateUrl } from '../utils/url-validator.js';
import { logger } from '../config/logging.js';

const router = express.Router();

// Vulnerable SSRF endpoint
router.get('/fetch/vulnerable', async (req, res) => {
  const url = decodeURIComponent(req.query.url);
  
  try {
    const response = await fetchUrl(url);
    if (response.success) {
      res.json(response.data);
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch URL',
        details: response.error
      });
    }
  } catch (error) {
    logger.error('SSRF error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch URL',
      details: error.message
    });
  }
});

// Secure SSRF endpoint
router.get('/fetch/secure', async (req, res) => {
  const url = decodeURIComponent(req.query.url);
  
  try {
    // Validate URL
    const validation = validateUrl(url);
    if (!validation.valid) {
      return res.status(403).json({ error: validation.error });
    }

    // Fetch from validated URL
    const response = await fetchUrl(validation.url, {
      timeout: 5000,
      maxRedirects: 3
    });

    if (response.success) {
      res.json(response.data);
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch URL',
        details: response.error
      });
    }
  } catch (error) {
    logger.error('SSRF error:', {
      url,
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Failed to fetch URL',
      details: error.message
    });
  }
});

export default router;