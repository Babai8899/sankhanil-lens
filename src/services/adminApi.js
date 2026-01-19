const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = 'https://sankha.online/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API
export const adminAuth = {
  async login(username, password) {
    const response = await fetch(`${API_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
    }
    return data;
  },

  async register(username, email, password) {
    const response = await fetch(`${API_URL}/admin/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return await response.json();
  },

  async verify() {
    const response = await fetch(`${API_URL}/admin/auth/verify`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Token verification failed');
    }
    
    return await response.json();
  },

  async changePassword(currentPassword, newPassword) {
    const response = await fetch(`${API_URL}/admin/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Password change failed');
    }
    
    return await response.json();
  },

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  getStoredUser() {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  }
};

// Statistics API
export const adminStats = {
  async getStats() {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    
    return await response.json();
  }
};

// Images API
export const adminImages = {
  async getImages(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    
    const response = await fetch(`${API_URL}/admin/images?${params}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    
    return await response.json();
  },

  async uploadImage(formData) {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/admin/images`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData
    });
    
    if (!response.ok) {
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      } else {
        // Server returned HTML or other non-JSON (likely a 413 or 502 error)
        const text = await response.text();
        if (response.status === 413) {
          throw new Error('Image file is too large. Maximum size is 25MB. Try compressing the image.');
        } else if (response.status === 502 || response.status === 504) {
          throw new Error('Upload timeout. Please try with a smaller image or check your connection.');
        } else {
          console.error('Server response:', text.substring(0, 200));
          throw new Error(`Upload failed with status ${response.status}. Please try again or check your connection.`);
        }
      }
    }
    
    return await response.json();
  },

  async updateImage(id, data) {
    const response = await fetch(`${API_URL}/admin/images/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Update failed');
    }
    
    return await response.json();
  },

  async deleteImage(id) {
    const response = await fetch(`${API_URL}/admin/images/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Delete failed');
    }
    
    return await response.json();
  }
};

// Messages API
export const adminMessages = {
  async getMessages(page = 1, limit = 20, unreadOnly = false) {
    const params = new URLSearchParams({
      page,
      limit,
      ...(unreadOnly && { unreadOnly: 'true' })
    });
    
    const response = await fetch(`${API_URL}/admin/messages?${params}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    return await response.json();
  },

  async markAsRead(id) {
    const response = await fetch(`${API_URL}/admin/messages/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark message as read');
    }
    
    return await response.json();
  },

  async markAsReplied(id) {
    const response = await fetch(`${API_URL}/admin/messages/${id}/replied`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark message as replied');
    }
    
    return await response.json();
  },

  async deleteMessage(id) {
    const response = await fetch(`${API_URL}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete message');
    }
    
    return await response.json();
  }
};
