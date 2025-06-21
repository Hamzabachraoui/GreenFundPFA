import { api } from './api';
import {
  Investment,
  InvestmentCreateData,
  InvestmentDashboard,
  PaymentIntentData,
  PaymentIntentResponse,
  PaymentConfirmationData,
} from '../types';

export const investmentsService = {
  // Create new investment
  async createInvestment(data: InvestmentCreateData): Promise<Investment> {
    const response = await api.post('/investments/', data);
    return response.data;
  },

  // Get all investments (filtered by user role)
  async getInvestments(): Promise<Investment[]> {
    const response = await api.get('/investments/list/');
    return response.data;
  },

  // Get investment by ID
  async getInvestment(id: number): Promise<Investment> {
    const response = await api.get(`/investments/${id}/`);
    return response.data;
  },

  // Update investment
  async updateInvestment(id: number, data: Partial<Investment>): Promise<Investment> {
    const response = await api.patch(`/investments/${id}/`, data);
    return response.data;
  },

  // Delete investment
  async deleteInvestment(id: number): Promise<void> {
    await api.delete(`/investments/${id}/`);
  },

  // Get user investments
  async getUserInvestments(): Promise<Investment[]> {
    const response = await api.get('/investments/list/');
    return response.data;
  },

  // Create payment intent
  async createPaymentIntent(data: PaymentIntentData): Promise<PaymentIntentResponse> {
    const response = await api.post('/investments/create-payment-intent/', data);
    return response.data;
  },

  // Confirm payment
  async confirmPayment(data: PaymentConfirmationData): Promise<Investment> {
    const response = await api.post('/investments/confirm-payment/', data);
    return response.data;
  },

  // Get investment dashboard data
  async getDashboardData(): Promise<InvestmentDashboard> {
    const response = await api.get('/investments/dashboard/');
    return response.data;
  }
}; 