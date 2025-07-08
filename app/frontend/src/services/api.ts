const API_URL = 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const api = {
  // Auth endpoints
  login: async (credentials: { email: string; password: string }) => {
    try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  signup: async (userData: { email: string; password: string; username: string }) => {
    try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      return data;
    } catch (error) {
      console.error('Signup API error:', error);
      throw error;
    }
  },

  // Profile endpoints
  getProfile: async () => {
    try {
    const response = await fetch(`${API_URL}/profile`, {
        headers: getAuthHeaders(),
    });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }
      
      return data;
    } catch (error) {
      console.error('Get profile API error:', error);
      throw error;
    }
  },

  updateProfile: async (profileData: any) => {
    try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
        headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      return data;
    } catch (error) {
      console.error('Update profile API error:', error);
      throw error;
    }
  },
}; 