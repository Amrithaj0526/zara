const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// For type safety
type RequestInit = globalThis.RequestInit;

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Generic API request function
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = `${API_URL}${endpoint}`;
  const headers = getAuthHeaders();
  
  const config: RequestInit = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Clear authentication data
export const clearAuth = (): void => {
  localStorage.removeItem('token');
}; 