# CrowdfundPro Mobile App

Application mobile Android pour la plateforme de crowdfunding CrowdfundPro, développée avec Jetpack Compose.

## 🚀 Fonctionnalités

### Authentification
- **Connexion** : Interface de connexion avec email et mot de passe
- **Inscription** : Création de compte avec choix du rôle (Porteur/Investisseur)
- **Gestion des tokens** : Authentification automatique avec refresh token

### Gestion des Projets
- **Liste des projets** : Affichage de tous les projets avec filtres et recherche
- **Détail d'un projet** : Informations complètes, progression, porteur
- **Création de projet** : Formulaire pour créer un nouveau projet (Porteurs)
- **Statuts** : En cours, Financé, Échoué, En attente de validation

### Investissements
- **Investir** : Interface pour investir dans un projet
- **Mes investissements** : Liste des investissements de l'utilisateur
- **Statuts** : En attente, Validé, Refusé

### Tableau de Bord
- **Vue d'ensemble** : Statistiques et actions rapides selon le rôle
- **Projets récents** : Pour les porteurs
- **Statistiques** : Pour les investisseurs

### Profil Utilisateur
- **Informations personnelles** : Affichage et modification du profil
- **Gestion du compte** : Changement de mot de passe, déconnexion

## 🛠️ Architecture

### Structure du Projet
```
app/src/main/java/com/example/myapplication/
├── data/
│   ├── api/
│   │   ├── ApiService.kt
│   │   └── RetrofitClient.kt
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
│   │   ├── ProjectsScreen.kt
│   │   ├── ProjectDetailScreen.kt
│   │   ├── InvestmentScreen.kt
│   │   ├── CreateProjectScreen.kt
│   │   ├── DashboardScreen.kt
│   │   ├── InvestmentsScreen.kt
│   │   └── ProfileScreen.kt
│   └── viewmodel/
│       ├── AuthViewModel.kt
│       ├── ProjectViewModel.kt
│       └── InvestmentViewModel.kt
└── MainActivity.kt
```

### Technologies Utilisées
- **Jetpack Compose** : Interface utilisateur moderne
- **Navigation Compose** : Navigation entre les écrans
- **ViewModel & LiveData** : Gestion de l'état de l'application
- **Retrofit** : Appels API REST
- **DataStore** : Stockage local des préférences
- **Coil** : Chargement d'images
- **Material Design 3** : Design system moderne

## 📱 Écrans Principaux

### 1. Écran d'Accueil (HomeScreen)
- Hero section avec présentation de la plateforme
- Statistiques générales
- Projets à la une (si connecté)
- Actions rapides selon le statut d'authentification

### 2. Authentification
- **LoginScreen** : Connexion avec email/mot de passe
- **RegisterScreen** : Inscription avec choix du rôle

### 3. Gestion des Projets
- **ProjectsScreen** : Liste avec filtres (recherche, statut, tri)
- **ProjectDetailScreen** : Détails complets d'un projet
- **CreateProjectScreen** : Création de nouveau projet

### 4. Investissements
- **InvestmentScreen** : Interface d'investissement
- **InvestmentsScreen** : Liste des investissements

### 5. Tableau de Bord
- **DashboardScreen** : Vue d'ensemble personnalisée selon le rôle

### 6. Profil
- **ProfileScreen** : Informations et actions sur le compte

## 🔧 Configuration

### Prérequis
- Android Studio Arctic Fox ou plus récent
- Android SDK 24+
- Kotlin 1.8+

### Installation
1. Cloner le projet
2. Ouvrir dans Android Studio
3. Configurer l'URL de l'API dans `RetrofitClient.kt`
4. Ajouter votre clé Google Maps API dans `AndroidManifest.xml`
5. Synchroniser le projet et compiler

### Configuration API
Modifier l'URL de base dans `RetrofitClient.kt` :
```kotlin
private const val BASE_URL = "http://10.0.2.2:8000/api/" // Pour l'émulateur
// ou
private const val BASE_URL = "http://votre-serveur.com/api/" // Pour un appareil réel
```

### Permissions
L'application nécessite les permissions suivantes :
- `INTERNET` : Appels API
- `ACCESS_NETWORK_STATE` : Vérification de la connectivité
- `ACCESS_FINE_LOCATION` : Géolocalisation (optionnel)
- `READ_EXTERNAL_STORAGE` : Upload d'images
- `CAMERA` : Prise de photos

## 🎨 Design

### Thème
- **Couleurs principales** : Bleu (#1976D2) et Bleu clair (#42A5F5)
- **Support du mode sombre** : Thème automatique selon les préférences système
- **Material Design 3** : Composants modernes et accessibles

### Composants Personnalisés
- Cards avec ombres et animations
- Progress bars pour les financements
- Status badges colorés
- Navigation fluide entre les écrans

## 🔐 Sécurité

### Authentification
- Tokens JWT avec refresh automatique
- Stockage sécurisé avec DataStore
- Gestion des erreurs 401/403

### Validation
- Validation côté client des formulaires
- Gestion des erreurs réseau
- Messages d'erreur utilisateur-friendly

## 📊 Fonctionnalités Avancées

### Gestion d'État
- ViewModels avec StateFlow
- Gestion des états de chargement
- Cache local des données

### Navigation
- Navigation type-safe avec arguments
- Gestion de la pile de navigation
- Deep linking support

### Performance
- Lazy loading des listes
- Optimisation des images avec Coil
- Gestion de la mémoire

## 🚀 Déploiement

### Build de Production
```bash
./gradlew assembleRelease
```

### Signing
Configurer le keystore dans `build.gradle.kts` :
```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("keystore.jks")
            storePassword = "password"
            keyAlias = "key"
            keyPassword = "password"
        }
    }
}
```

## 📝 Notes de Développement

### Structure MVVM
- **Model** : Data classes et repositories
- **View** : Composables Compose
- **ViewModel** : Logique métier et gestion d'état

### Gestion des Erreurs
- Try-catch dans les repositories
- États d'erreur dans les ViewModels
- Affichage utilisateur-friendly des erreurs

### Tests
- Tests unitaires pour les ViewModels
- Tests d'intégration pour les repositories
- Tests UI pour les composables

## 🔄 Mises à Jour

### Version 1.0
- ✅ Authentification complète
- ✅ Gestion des projets
- ✅ Système d'investissement
- ✅ Tableau de bord
- ✅ Profil utilisateur

### Prochaines Fonctionnalités
- [ ] Notifications push
- [ ] Chat entre utilisateurs
- [ ] Système de paiement intégré
- [ ] Géolocalisation des projets
- [ ] Mode hors ligne
- [ ] Analytics et statistiques avancées

## 📞 Support

Pour toute question ou problème :
1. Vérifier la configuration de l'API
2. Consulter les logs dans Android Studio
3. Vérifier la connectivité réseau
4. Contacter l'équipe de développement

---

**CrowdfundPro Mobile** - Une application moderne pour le crowdfunding 🚀 