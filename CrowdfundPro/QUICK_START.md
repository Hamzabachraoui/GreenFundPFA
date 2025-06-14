# 🚀 Guide de Démarrage Rapide - CrowdfundPro

## Installation Automatique

### Windows
```powershell
.\install.ps1
```

### Linux/Mac
```bash
./install.sh
```

## Installation Manuelle

### 1. Backend Django

```bash
cd crowdfundpro_backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp env_example.txt .env
# Éditer le fichier .env avec vos clés

# Migrations de base de données
python manage.py makemigrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
```

### 2. Frontend Next.js

```bash
cd crowdfundpro_frontend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp env.local.example .env.local
# Éditer le fichier .env.local avec vos clés

# Démarrer le serveur de développement
npm run dev
```

## Configuration Minimale

### Backend (.env)
```env
SECRET_KEY=your_secret_key_here
DEBUG=True
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Accès à l'Application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000/api
- **Admin Django** : http://localhost:8000/admin

## Comptes de Test

Créez des comptes avec les rôles suivants :

### Porteur de Projet
- Email : porteur@test.com
- Rôle : PORTEUR
- Peut créer et gérer des projets

### Investisseur
- Email : investisseur@test.com
- Rôle : INVESTISSEUR
- Peut investir dans les projets

## Fonctionnalités Principales

### ✅ Authentification
- [x] Inscription avec rôles (PORTEUR/INVESTISSEUR)
- [x] Connexion/Déconnexion
- [x] Gestion des profils
- [x] JWT Tokens

### ✅ Gestion des Projets
- [x] Création de projets (Porteurs)
- [x] Liste des projets avec filtres
- [x] Détails des projets
- [x] Mise à jour automatique des statuts
- [x] Upload d'images

### ✅ Investissements
- [x] Création d'investissements
- [x] Intégration Stripe pour les paiements
- [x] Tableau de bord des investissements
- [x] Historique des transactions

### ✅ Interface Utilisateur
- [x] Design moderne avec Tailwind CSS
- [x] Responsive design
- [x] Animations et transitions
- [x] Notifications toast
- [x] Loading states

## Structure du Projet

```
CrowdfundPro/
├── crowdfundpro_backend/     # API Django
│   ├── users/               # Gestion des utilisateurs
│   ├── projects/            # Gestion des projets
│   ├── investments/         # Gestion des investissements
│   └── crowdfundpro_backend/ # Configuration Django
├── crowdfundpro_frontend/    # Interface Next.js
│   ├── src/
│   │   ├── app/            # Pages Next.js
│   │   ├── components/     # Composants React
│   │   ├── context/        # Contextes React
│   │   ├── services/       # Services API
│   │   ├── types/          # Types TypeScript
│   │   └── styles/         # Styles CSS
│   └── public/             # Assets statiques
├── README.md               # Documentation principale
├── QUICK_START.md          # Ce guide
├── install.sh              # Script d'installation Linux/Mac
└── install.ps1             # Script d'installation Windows
```

## Prochaines Étapes

1. **Configurer Stripe** : Obtenez vos clés API sur https://stripe.com
2. **Base de données** : Configurez PostgreSQL pour la production
3. **Déploiement** : Utilisez Heroku (backend) et Vercel (frontend)
4. **Personnalisation** : Adaptez le design à vos besoins

## Support

- 📖 Documentation complète : `README.md`
- 🐛 Problèmes : Vérifiez les logs du backend et frontend
- 💡 Améliorations : Le code est modulaire et extensible

## Technologies Utilisées

- **Backend** : Django 4.2, Django REST Framework, PostgreSQL, Stripe
- **Frontend** : Next.js 14, React 18, TypeScript, Tailwind CSS
- **Authentification** : JWT
- **Paiements** : Stripe
- **Base de données** : PostgreSQL (production) / SQLite (développement) 