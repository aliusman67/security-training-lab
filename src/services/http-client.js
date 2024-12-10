import axios from 'axios';

const httpClient = axios.create({
  timeout: 5000,
  maxRedirects: 3,
  validateStatus: status => status >= 200 && status < 300
});

export async function fetchUrl(url) {
  try {
    const response = await httpClient.get(url);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}