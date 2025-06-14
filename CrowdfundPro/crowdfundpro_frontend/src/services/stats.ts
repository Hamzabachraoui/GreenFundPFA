import api from './api';

export interface PorteurStats {
  totalProjects: number;
  totalFunding: number;
  successRate: number;
  topProjects: Array<{
    name: string;
    funding: number;
  }>;
  monthlyStats: Array<{
    month: string;
    newProjects: number;
    totalFunding: number;
    newInvestments: number;
  }>;
  recentInvestments: Array<{
    projectName: string;
    amount: number;
    date: string;
    investorName: string;
  }>;
}

export interface InvestisseurStats {
  totalInvested: number;
  numberOfInvestments: number;
  potentialROI: number;
  averageInvestment: number;
  portfolioDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  investmentHistory: Array<{
    date: string;
    amount: number;
  }>;
}

export const statsService = {
  // Get porteur statistics
  async getPorteurStats(): Promise<PorteurStats> {
    const response = await api.get('/projects/stats/porteur/');
    return response.data;
  },

  // Get investisseur statistics
  async getInvestisseurStats(): Promise<InvestisseurStats> {
    const response = await api.get('/projects/stats/investisseur/');
    return response.data;
  }
}; 