const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const profileApi = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },

  updateProfile: async (profileData: any) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_URL}/profile/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return response.json();
  },
}; 