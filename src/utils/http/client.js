import axios from 'axios';

const httpClient = axios.create({
  timeout: 5000,
  maxRedirects: 3,
  validateStatus: status => status >= 200 && status < 300,
  headers: {
    'User-Agent': 'SecurityLab/1.0'
  }
});

export async function fetchUrl(url, options = {}) {
  try {
    const response = await httpClient.get(url, {
      ...options,
      headers: {
        ...httpClient.defaults.headers,
        ...options.headers
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
}

export async function postData(url, data, options = {}) {
  try {
    const response = await httpClient.post(url, data, {
      ...options,
      headers: {
        ...httpClient.defaults.headers,
        ...options.headers
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
}