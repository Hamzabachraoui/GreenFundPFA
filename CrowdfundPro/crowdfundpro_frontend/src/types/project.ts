export interface Project {
  id: number;
  titre: string;
  description: string;
  image_url?: string;
  objectif: number;
  montant_actuel: number;
  montant_requis: number;
  pourcentage_finance: number;
  nombre_investisseurs: number;
  jours_restants: number;
  categorie: string;
  date_creation: string;
  date_limite: string;
  statut: 'EN_ATTENTE_VALIDATION' | 'EN_COURS' | 'FINANCE' | 'ECHOUE';
  statut_display?: string;
  porteur: {
    id: number;
    username: string;
    nom: string;
    email: string;
    date_inscription: string;
  };
  // Nouveaux champs pour la localisation
  latitude?: number;
  longitude?: number;
  adresse?: string;
  a_localisation?: boolean;
  // Nouveaux champs pour les documents
  business_plan?: string;
  plan_juridique?: string;
} 