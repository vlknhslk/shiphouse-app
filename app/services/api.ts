import axios from 'axios';
import { Package } from '@/types/package';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export const packageService = {
  async processPackage(trackingNumber: string): Promise<Package> {
    try {
      const response = await api.post('/packages/process', { trackingNumber });
      return response.data;
    } catch (error) {
      throw new Error('Package processing failed');
    }
  },

  async getPackageStatus(id: string): Promise<Package> {
    try {
      const response = await api.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to get package status');
    }
  },
};
