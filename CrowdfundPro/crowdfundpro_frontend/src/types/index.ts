// User types
export interface User {
  id: number;
  email: string;
  username: string;
  nom: string;
  role: 'ADMIN' | 'PORTEUR' | 'INVESTISSEUR';
  date_inscription: string;
  telephone?: string;
  adresse?: string;
  token?: string;
  is_active: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  nom: string;
  password: string;
  password2: string;
  role: 'PORTEUR' | 'INVESTISSEUR';
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

// Project types
export interface Project {
  id: number;
  titre: string;
  description: string;
  objectif: number;
  montant_actuel: number;
  date_creation: string;
  date_limite: string;
  statut: 'EN_COURS' | 'FINANCE' | 'ECHOUE';
  statut_display: string;
  categorie: string;
  image: string;
  porteur: User;
  nombre_investisseurs: number;
  pourcentage_finance: number;
  montant_cible: number;
  date_debut: string;
  date_fin: string;
  investissements?: Investment[];
}

export interface ProjectCreateData {
  titre: string;
  description: string;
  objectif: number;
  date_limite: string;
  image?: File;
}

export interface ProjectStats {
  total: number;
  en_cours: number;
  finance: number;
  echoue: number;
  montant_total: number;
  montant_moyen: number;
}

// Investment types
export interface Investment {
  id: number;
  projet: Project;
  investisseur: User;
  montant: number;
  date_investissement: string;
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';
  statut_display: string;
}

export interface InvestmentCreateData {
  projet: number;
  montant: number;
}

export interface InvestmentStats {
  total: number;
  en_attente: number;
  valide: number;
  refuse: number;
  montant_total: number;
  montant_moyen: number;
}

export interface InvestmentDashboard {
  stats: InvestmentStats;
  recent_investments: Investment[];
}

export interface PaymentIntentData {
  investment_id: number;
}

export interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

export interface PaymentConfirmationData {
  payment_intent_id: string;
  investment_id: number;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  errors?: { [key: string]: string[] };
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Form types
export interface FormError {
  [key: string]: string | string[];
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: any;
  requiresAuth?: boolean;
  roles?: ('PORTEUR' | 'INVESTISSEUR')[];
}

// Dashboard types
export interface DashboardStats {
  projects?: ProjectStats;
  investments?: InvestmentDashboard;
} 