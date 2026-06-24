// API configuration utility
export const getAPIUrl = () => {
  let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Remove trailing slash if present
  if (apiUrl.endsWith('/')) {
    apiUrl = apiUrl.slice(0, -1);
  }
  
  return apiUrl;
};

export const API_URL = getAPIUrl();
