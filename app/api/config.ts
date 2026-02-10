/**
 * API Configuration
 * Dynamically determines the API base URL based on the frontend access method
 */

export const getApiBaseUrl = (): string => {
  // Use env variable if explicitly set
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Dynamically determine based on window location (client-side only)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If accessing via localhost, use localhost backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    
    // If accessing via network IP, use network IP backend
    if (hostname.startsWith('192.168')) {
      return `http://${hostname}:8000`;
    }
  }
  
  // Default fallback for SSR or unknown environments
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

