# CrowdfundPro Installation Script for Windows
Write-Host "🚀 Installation de CrowdfundPro" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>$null
    Write-Host "✅ Python détecté: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python n'est pas installé. Veuillez l'installer d'abord." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer d'abord." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prérequis vérifiés" -ForegroundColor Green

# Backend setup
Write-Host "📦 Configuration du backend Django..." -ForegroundColor Yellow
Set-Location crowdfundpro_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
& "venv\Scripts\Activate.ps1"

# Install Python dependencies
pip install -r requirements.txt

# Copy environment file
if (-not (Test-Path ".env")) {
    Copy-Item "env_example.txt" ".env"
    Write-Host "📝 Fichier .env créé. Veuillez le configurer avec vos clés API." -ForegroundColor Yellow
}

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
Write-Host "👤 Création d'un superutilisateur Django (optionnel):" -ForegroundColor Yellow
try {
    python manage.py createsuperuser --noinput --email admin@crowdfundpro.com --username admin
} catch {
    Write-Host "Superutilisateur déjà existant ou erreur lors de la création" -ForegroundColor Yellow
}

Set-Location ..

# Frontend setup
Write-Host "🎨 Configuration du frontend Next.js..." -ForegroundColor Yellow
Set-Location crowdfundpro_frontend

# Install Node.js dependencies
npm install

# Copy environment file
if (-not (Test-Path ".env.local")) {
    Copy-Item "env.local.example" ".env.local"
    Write-Host "📝 Fichier .env.local créé. Veuillez le configurer avec vos clés API." -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "🎉 Installation terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Configurez les fichiers .env avec vos clés API (Stripe, base de données)" -ForegroundColor White
Write-Host "2. Démarrez le backend : cd crowdfundpro_backend && python manage.py runserver" -ForegroundColor White
Write-Host "3. Démarrez le frontend : cd crowdfundpro_frontend && npm run dev" -ForegroundColor White
Write-Host "4. Ouvrez http://localhost:3000 dans votre navigateur" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation complète disponible dans README.md" -ForegroundColor Cyan 