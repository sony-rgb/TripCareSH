import { API_BASE_URL } from '../appConfig';

/**
 * API Configuration
 * Central place for API-related constants and configurations
 */

// Health check endpoint - used to verify API connectivity
export const API_HEALTH_ENDPOINT = `${API_BASE_URL}/api/v1/health`;

// Timeout for health check requests (in milliseconds)
// Short timeout to quickly determine if API is reachable
export const API_HEALTH_TIMEOUT = 5000; // 5 seconds

// Interval for periodic connectivity checks (in milliseconds)
export const CONNECTIVITY_CHECK_INTERVAL = 60000; // 60 seconds

/**
 * Makes a health check request to the API
 * @returns Promise<boolean> - true if API is reachable, false otherwise
 */
export const checkApiHealth = async (): Promise<boolean> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_HEALTH_TIMEOUT);

  try {
    const response = await fetch(API_HEALTH_ENDPOINT, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    // Consider API reachable only if we get a 2xx status
    return response.ok && response.status >= 200 && response.status < 300;
  } catch (error: any) {
    clearTimeout(timeoutId);

    // All errors (timeout, DNS failure, network error) mean API is not reachable
    console.log('API health check failed:', error.message);
    return false;
  }
};

