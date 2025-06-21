import { api } from './api';
import { User } from '../types';

export const userService = {
  // Get user profile
  async getProfile(): Promise<User> {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch('/users/profile/', data);
    return response.data;
  },

  // Get all users (admin only)
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users/list/');
    return response.data;
  },

  // Delete user (admin only)
  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}/`);
  }
}; 