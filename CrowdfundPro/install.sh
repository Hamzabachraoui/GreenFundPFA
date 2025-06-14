#!/bin/bash

echo "🚀 Installation de CrowdfundPro"
echo "================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Backend setup
echo "📦 Configuration du backend Django..."
cd crowdfundpro_backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install Python dependencies
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    cp env_example.txt .env
    echo "📝 Fichier .env créé. Veuillez le configurer avec vos clés API."
fi

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
echo "👤 Création d'un superutilisateur Django (optionnel):"
python manage.py createsuperuser --noinput --email admin@crowdfundpro.com --username admin || true

cd ..

# Frontend setup
echo "🎨 Configuration du frontend Next.js..."
cd crowdfundpro_frontend

# Install Node.js dependencies
npm install

# Copy environment file
if [ ! -f .env.local ]; then
    cp env.local.example .env.local
    echo "📝 Fichier .env.local créé. Veuillez le configurer avec vos clés API."
fi

cd ..

echo ""
echo "🎉 Installation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez les fichiers .env avec vos clés API (Stripe, base de données)"
echo "2. Démarrez le backend : cd crowdfundpro_backend && python manage.py runserver"
echo "3. Démarrez le frontend : cd crowdfundpro_frontend && npm run dev"
echo "4. Ouvrez http://localhost:3000 dans votre navigateur"
echo ""
echo "📚 Documentation complète disponible dans README.md" 