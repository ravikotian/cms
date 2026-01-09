/**
 * Safe API Client Utility
 * Handles calls to external APIs with graceful error handling
 * Prevents app crashes from network errors
 */

import axios from 'axios';

const HEROKU_API = 'https://immense-river-40491.herokuapp.com';

/**
 * Makes a safe API request with error handling
 * @param {string} method - HTTP method (GET, POST, DELETE, PATCH, etc.)
 * @param {string} endpoint - API endpoint
 * @param {any} data - Request data (optional)
 * @returns {Promise} - Resolves to response data or null on error
 */
export const safeApiCall = async (method, endpoint, data = null) => {
  try {
    const url = `${HEROKU_API}${endpoint}`;
    
    const config = {
      method,
      url,
      timeout: 5000 // 5 second timeout
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    // Silently log error instead of throwing
    console.warn(`API call failed [${method} ${endpoint}]:`, error.message);
    return null;
  }
};

/**
 * GET request helper
 */
export const apiGet = (endpoint) => {
  return safeApiCall('GET', endpoint);
};

/**
 * DELETE request helper
 */
export const apiDelete = (endpoint) => {
  return safeApiCall('DELETE', endpoint);
};

/**
 * PATCH request helper
 */
export const apiPatch = (endpoint, data) => {
  return safeApiCall('PATCH', endpoint, data);
};

/**
 * POST request helper
 */
export const apiPost = (endpoint, data) => {
  return safeApiCall('POST', endpoint, data);
};
