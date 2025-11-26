const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://141.148.217.223:3000/api';

export const imageApi = {
  // Get all images
  async getAllImages(category = null) {
    try {
      const url = category && category !== 'all' 
        ? `${API_BASE_URL}/images?category=${category.toLowerCase()}`
        : `${API_BASE_URL}/images`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch images');
      return await response.json();
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  },

  // Get home page images (01-02 for each category)
  async getHomeImages() {
    try {
      const response = await fetch(`${API_BASE_URL}/images/home`);
      if (!response.ok) throw new Error('Failed to fetch home images');
      return await response.json();
    } catch (error) {
      console.error('Error fetching home images:', error);
      throw error;
    }
  },

  // Get gallery images (03-07 for each category)
  async getGalleryImages(category = null) {
    try {
      const url = category && category !== 'all'
        ? `${API_BASE_URL}/images/gallery?category=${category.toLowerCase()}`
        : `${API_BASE_URL}/images/gallery`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch gallery images');
      return await response.json();
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      throw error;
    }
  },

  // Get single image metadata
  async getImageMeta(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/images/meta/${id}`);
      if (!response.ok) throw new Error('Failed to fetch image metadata');
      return await response.json();
    } catch (error) {
      console.error('Error fetching image metadata:', error);
      throw error;
    }
  },

  // Get image URL for display (watermarked)
  getImageUrl(id, quality = 'low') {
    return `${API_BASE_URL}/images/view/${id}?quality=${quality}&t=${Date.now()}`;
  },

  // Get token for secure image access
  async getImageToken(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/images/token/${id}`);
      if (!response.ok) throw new Error('Failed to get image token');
      return await response.json();
    } catch (error) {
      console.error('Error getting image token:', error);
      throw error;
    }
  },

  // Get secure image URL with token
  async getSecureImageUrl(id, applyWatermark = false) {
    try {
      const { token } = await this.getImageToken(id);
      const watermarkParam = applyWatermark ? '&watermark=true' : '';
      return `${API_BASE_URL}/images/view/${id}?token=${token}${watermarkParam}&t=${Date.now()}`;
    } catch (error) {
      console.error('Error getting secure image URL:', error);
      throw error;
    }
  },

  // Upload new image (admin only)
  async uploadImage(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to upload image');
      return await response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Delete image (admin only)
  async deleteImage(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/images/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete image');
      return await response.json();
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },
};
