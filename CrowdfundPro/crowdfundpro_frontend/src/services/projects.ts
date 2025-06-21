import { api } from './api';
import { Project, ProjectCreateData, ProjectStats, PaginatedResponse } from '../types';

interface ProjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

export const projectsService = {
  // Get all projects with optional filters
  async getProjects(params?: any): Promise<{ results: Project[]; count: number }> {
    const response = await api.get('/projects/', { params });
    return response.data;
  },

  // Get project by ID
  async getProject(id: number): Promise<Project> {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },

  // Create new project
  async createProject(data: ProjectCreateData): Promise<Project> {
    const formData = new FormData();
    
    // Append text fields
    formData.append('titre', data.titre);
    formData.append('description', data.description);
    formData.append('objectif', data.objectif.toString());
    formData.append('date_limite', data.date_limite);
    
    // Append location fields if provided
    if (data.latitude !== undefined) {
      formData.append('latitude', data.latitude.toString());
    }
    if (data.longitude !== undefined) {
      formData.append('longitude', data.longitude.toString());
    }
    if (data.adresse) {
      formData.append('adresse', data.adresse);
    }
    
    // Append image if exists
    if (data.image) {
      formData.append('image', data.image);
    }
    
    // Append documents if provided
    if (data.business_plan) {
      formData.append('business_plan', data.business_plan);
    }
    if (data.plan_juridique) {
      formData.append('plan_juridique', data.plan_juridique);
    }

    const response = await api.post('/projects/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update project
  async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    const response = await api.patch(`/projects/${id}/`, data);
    return response.data;
  },

  // Delete project
  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}/`);
  },

  // Get user's projects
  async getUserProjects(): Promise<Project[]> {
    try {
      console.log('📥 Récupération des projets utilisateur...');
      const response = await api.get('/projects/user/');
      console.log('✅ Projets utilisateur reçus:', response.data);
      // La réponse est directement un tableau pour cette route
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des projets utilisateur:', error);
      throw error;
    }
  },

  // Get project statistics
  async getProjectStats(id: number): Promise<ProjectStats> {
    const response = await api.get(`/projects/${id}/stats/`);
    return response.data;
  },

  // Update project status (admin only)
  async updateProjectStatus(id: number): Promise<Project> {
    const response = await api.post(`/projects/${id}/update_status/`);
    return response.data;
  },

  // Validate project (admin only)
  async validateProject(id: number): Promise<Project> {
    const response = await api.post(`/projects/${id}/validate/`);
    return response.data;
  },

  // Get projects for a specific porteur
  async getPorteurProjects(porteurId: string): Promise<ProjectsResponse> {
    const response = await api.get(`/projects/?porteur=${porteurId}`);
    return response.data;
  }
}; 