// Image API Service for React Native
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.API_BASE_URL;

export const imageApi = {
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

  // Get all images
  async getAllImages(category: string | null = null) {
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

  // Get gallery images (03-07 for each category)
  async getGalleryImages(category: string | null = null) {
    try {
      const url = category && category !== 'all'
        ? `${API_BASE_URL}/images/gallery?category=${(category as string).toLowerCase()}`
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
  async getImageMeta(id: string) {
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
  getImageUrl(id: string, quality: string = 'low') {
    return `${API_BASE_URL}/images/view/${id}?quality=${quality}&t=${Date.now()}`;
  },

  // Get token for secure image access
  async getImageToken(id: string) {
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
  async getSecureImageUrl(id: string, applyWatermark: boolean = false) {
    try {
      const { token } = await this.getImageToken(id);
      const watermarkParam = applyWatermark ? '&watermark=true' : '';
      return `${API_BASE_URL}/images/view/${id}?token=${token}${watermarkParam}&t=${Date.now()}`;
    } catch (error) {
      console.error('Error getting secure image URL:', error);
      throw error;
    }
  },
};
