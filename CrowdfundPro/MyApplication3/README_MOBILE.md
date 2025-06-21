# CrowdfundPro Mobile App

Application mobile Android pour la plateforme de financement participatif CrowdfundPro, développée avec Kotlin et Jetpack Compose.

## 🚀 Fonctionnalités

### Authentification
- Connexion utilisateur
- Inscription
- Gestion des sessions avec JWT
- Stockage sécurisé des tokens

### Gestion des Projets
- Affichage de la liste des projets
- Détails complets d'un projet
- Création de nouveaux projets
- Upload d'images et documents
- Géolocalisation des projets

### Investissements
- Consultation des projets disponibles
- Effectuer des investissements
- Historique des investissements
- Suivi des montants investis

### Tableau de Bord
- Vue d'ensemble des projets créés
- Statistiques des investissements
- Navigation rapide vers les fonctionnalités

### Profil Utilisateur
- Gestion des informations personnelles
- Modification du profil
- Déconnexion

## 🛠 Architecture

### Structure du Projet
```
app/src/main/java/com/example/myapplication/
├── backend/
│   ├── database/
│   │   ├── DatabaseHelper.kt
│   │   └── DatabaseInitializer.kt
│   └── service/
│       ├── AuthService.kt
│       ├── ProjectService.kt
│       └── InvestmentService.kt
├── data/
│   ├── api/
│   ├── model/
│   │   ├── User.kt
│   │   ├── Project.kt
│   │   └── Investment.kt
│   └── repository/
│       ├── AuthRepository.kt
│       ├── ProjectRepository.kt
│       └── InvestmentRepository.kt
├── ui/
│   ├── navigation/
│   │   ├── AppNavigation.kt
│   │   └── Screen.kt
│   ├── screens/
│   │   ├── HomeScreen.kt
│   │   ├── LoginScreen.kt
│   │   ├── RegisterScreen.kt
│   │   ├── DashboardScreen.kt
│   │   ├── ProjectsScreen.kt
│   │   ├── CreateProjectScreen.kt
│   │   ├── ProjectDetailScreen.kt
│   │   ├── InvestmentsScreen.kt
│   │   ├── InvestmentScreen.kt
│   │   └── ProfileScreen.kt
│   ├── theme/
│   │   ├── Color.kt
│   │   ├── Theme.kt
│   │   └── Type.kt
│   └── viewmodel/
│       ├── AuthViewModel.kt
│       ├── ProjectViewModel.kt
│       └── InvestmentViewModel.kt
└── MainActivity.kt
```

### Technologies Utilisées
- **Kotlin** - Langage de programmation principal
- **Jetpack Compose** - UI moderne et déclarative
- **SQLite** - Base de données locale
- **DataStore** - Stockage des préférences
- **ViewModel & LiveData** - Gestion de l'état
- **Navigation Compose** - Navigation entre écrans
- **Coroutines** - Programmation asynchrone
- **Coil** - Chargement d'images

## 📱 Installation

### Prérequis
- Android Studio Arctic Fox ou plus récent
- Android SDK 24+
- Kotlin 1.8+

### Étapes d'Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd CrowdfundPro/MyApplication3
   ```

2. **Ouvrir dans Android Studio**
   - Ouvrir Android Studio
   - Sélectionner "Open an existing project"
   - Naviguer vers le dossier `MyApplication3`

3. **Synchroniser le projet**
   - Attendre la synchronisation Gradle
   - Résoudre les dépendances si nécessaire

4. **Configurer l'émulateur**
   - Créer un émulateur Android API 24+
   - Ou connecter un appareil physique

5. **Lancer l'application**
   - Cliquer sur "Run" (▶️)
   - Sélectionner l'appareil cible

## 🔧 Configuration

### Base de Données
L'application utilise SQLite en local avec les tables suivantes :
- `users` - Utilisateurs de l'application
- `projects` - Projets de financement
- `investments` - Investissements des utilisateurs

### Permissions
L'application nécessite les permissions suivantes :
- `INTERNET` - Connexion réseau
- `ACCESS_NETWORK_STATE` - État du réseau
- `READ_EXTERNAL_STORAGE` - Lecture des fichiers
- `WRITE_EXTERNAL_STORAGE` - Écriture des fichiers
- `READ_MEDIA_IMAGES` - Accès aux images

## 🎨 Interface Utilisateur

### Design System
- **Couleurs** : Palette bleue professionnelle
- **Typographie** : Material Design 3
- **Composants** : Jetpack Compose Material 3
- **Navigation** : Bottom Navigation + Navigation Drawer

### Écrans Principaux
1. **Accueil** - Présentation de la plateforme
2. **Connexion/Inscription** - Authentification
3. **Tableau de Bord** - Vue d'ensemble
4. **Projets** - Liste et détails
5. **Investissements** - Gestion des investissements
6. **Profil** - Gestion du compte

## 🔐 Sécurité

### Authentification
- JWT tokens pour l'authentification
- Stockage sécurisé avec DataStore
- Validation des sessions

### Données
- Chiffrement des mots de passe
- Validation des entrées utilisateur
- Protection contre les injections SQL

## 📊 Fonctionnalités Avancées

### Géolocalisation
- Sélection de l'emplacement des projets
- Affichage sur carte
- Calcul des distances

### Upload de Fichiers
- Images de projets
- Documents PDF
- Gestion des permissions

### Notifications
- Notifications push (à implémenter)
- Alertes d'investissement
- Mises à jour de projets

## 🧪 Tests

### Tests Unitaires
```bash
./gradlew test
```

### Tests d'Interface
```bash
./gradlew connectedAndroidTest
```

## 📦 Build

### Debug
```bash
./gradlew assembleDebug
```

### Release
```bash
./gradlew assembleRelease
```

## 🚀 Déploiement

### Google Play Store
1. Générer un APK signé
2. Créer un compte développeur
3. Uploader l'APK
4. Configurer la fiche d'application

### Distribution Interne
1. Générer un APK
2. Partager via email/cloud
3. Installer manuellement

## 🔄 Mise à Jour

### Base de Données
Les migrations de base de données sont gérées automatiquement par SQLite.

### Application
Les mises à jour se font via le Google Play Store ou par réinstallation.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Consulter la documentation technique
- Contacter l'équipe de développement

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Développé avec ❤️ pour CrowdfundPro** 