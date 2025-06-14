# CrowdfundPro - Plateforme de Crowdfunding

## Description
CrowdfundPro est une plateforme de crowdfunding moderne permettant aux porteurs de projets de soumettre des projets à financer et aux investisseurs de contribuer via des paiements sécurisés avec Stripe.

## Architecture
- **Backend** : Django + Django REST Framework
- **Frontend** : Next.js (React) + Tailwind CSS
- **Base de données** : PostgreSQL
- **Paiements** : Stripe
- **Authentification** : JWT

## Structure du Projet
```
CrowdfundPro/
├── crowdfundpro_backend/     # API Django
├── crowdfundpro_frontend/    # Interface Next.js
├── README.md
└── .gitignore
```

## Installation

### Prérequis
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Compte Stripe

### Backend (Django)
```bash
cd crowdfundpro_backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (Next.js)
```bash
cd crowdfundpro_frontend
npm install
npm run dev
```

## Configuration des Variables d'Environnement

### Backend (.env)
```
SECRET_KEY=your_django_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/crowdfundpro
STRIPE_SECRET_KEY=sk_test_...
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Fonctionnalités

### Authentification
- Inscription avec rôle (PORTEUR/INVESTISSEUR)
- Connexion sécurisée
- Gestion des profils

### Gestion des Projets
- Soumission de projets
- Liste avec filtres
- Détails et progression
- Mise à jour automatique des statuts

### Investissements
- Paiements sécurisés avec Stripe
- Tableau de bord des investissements
- Historique des transactions

## API Endpoints

### Authentification
- `POST /api/token/` - Connexion
- `POST /api/users/` - Inscription
- `GET /api/users/{id}/profile/` - Profil

### Projets
- `POST /api/projects/` - Créer un projet
- `GET /api/projects/` - Liste des projets
- `GET /api/projects/{id}/` - Détails d'un projet

### Investissements
- `POST /api/investments/` - Créer un investissement
- `GET /api/investments/dashboard/` - Tableau de bord

## Déploiement
- **Backend** : Heroku ou serveur VPS
- **Frontend** : Vercel ou Netlify

## Licence
MIT License 