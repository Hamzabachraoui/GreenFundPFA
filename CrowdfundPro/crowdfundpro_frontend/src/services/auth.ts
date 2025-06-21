import { api } from './api';
import { LoginData, RegisterData, AuthResponse, User } from '../types';

interface AuthTokens {
  access: string;
  refresh: string;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const requestPasswordReset = (email: string): Promise<void> => {
  return api.post('/users/password_reset/', { email });
};

const confirmPasswordReset = (password: string, token: string): Promise<void> => {
  return api.post('/users/password_reset/confirm/', { password, token });
};

export const authService = {
  // Login user
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await api.post('/users/login/', credentials);
    const { access, refresh, user } = response.data;
    
    // Store tokens
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    
    // Set token in API headers
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    return {
      user,
      tokens: { access, refresh }
    };
  },

  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/users/register/', data);
    const { access, refresh, user } = response.data;
    
    // Store tokens
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    
    // Set token in API headers
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
    
    return {
      user,
      tokens: { access, refresh }
    };
  },

  // Logout user
  async logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get('/users/profile/');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch('/users/profile/', data);
    return response.data;
  },

  // Refresh token
  async refreshToken(): Promise<AuthTokens> {
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refresh) {
      throw new Error('No refresh token found');
    }

    const response = await api.post('/token/refresh/', { refresh });
    const { access } = response.data;

    // Store new access token
    localStorage.setItem(TOKEN_KEY, access);

    // Update token in API headers
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

    return {
      access,
      refresh
    };
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setStoredUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearStoredUser() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  },

  // Password Reset
  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/users/password_reset/', { email });
  },

  async confirmPasswordReset(password: string, token: string): Promise<void> {
    await api.post('/users/password_reset/confirm/', { password, token });
  },
}; 