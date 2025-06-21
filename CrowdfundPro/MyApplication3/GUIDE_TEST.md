# 🚀 Guide de Test - CrowdfundPro Mobile

## ✅ Système d'Authentification Complet

Votre application mobile a maintenant un système d'authentification complet avec :

- ✅ **Vérification réelle des mots de passe** (plus de "true" automatique)
- ✅ **Inscription d'utilisateurs** avec validation
- ✅ **Connexion sécurisée** avec hashage SHA-256
- ✅ **Base de données SQLite locale** sur le téléphone
- ✅ **Gestion des rôles** (Investisseur, Porteur, Admin)

## 📱 Comment Tester

### 1. **Lancer l'Application**
- Ouvrez Android Studio
- Connectez votre téléphone
- Cliquez sur ▶️ (Run)

### 2. **Première Utilisation - Inscription**
1. **Ouvrez l'app** → Écran d'accueil
2. **Cliquez sur "Se connecter"** → Écran de connexion
3. **Cliquez sur "Pas encore de compte ? S'inscrire"** → Écran d'inscription
4. **Remplissez le formulaire :**
   - Email : `test@example.com`
   - Nom d'utilisateur : `testuser`
   - Nom complet : `Test User`
   - Rôle : `Investisseur` (ou `Porteur de projet`)
   - Mot de passe : `123456`
   - Confirmer : `123456`
5. **Cliquez sur "S'inscrire"**

### 3. **Connexion**
1. **Retournez à l'écran de connexion**
2. **Entrez vos identifiants :**
   - Email : `test@example.com`
   - Mot de passe : `123456`
3. **Cliquez sur "Se connecter"**

### 4. **Test de la Base de Données**
1. **Sur l'écran de connexion**
2. **Cliquez sur "🔍 Test Base de Données"**
3. **Vérifiez dans les logs** que votre utilisateur apparaît

## 🔒 Sécurité

### **Mots de Passe Hashés**
- Les mots de passe sont hashés avec SHA-256
- Stockés de manière sécurisée dans SQLite
- Vérification réelle lors de la connexion

### **Validation**
- ✅ Email unique
- ✅ Mots de passe identiques
- ✅ Champs obligatoires
- ✅ Messages d'erreur clairs

## 🗄️ Base de Données

### **Tables Créées**
- `users` : Utilisateurs avec mots de passe hashés
- `projects` : Projets de crowdfunding
- `investments` : Investissements
- `tokens` : Tokens d'authentification

### **Données Stockées**
- Toutes les données sont locales sur votre téléphone
- Pas besoin d'internet
- Persistance entre les sessions

## 🎯 Fonctionnalités Disponibles

### **Après Connexion**
- ✅ Dashboard personnalisé
- ✅ Liste des projets
- ✅ Création de projets (si Porteur)
- ✅ Investissement (si Investisseur)
- ✅ Profil utilisateur

### **Navigation**
- ✅ Écran d'accueil
- ✅ Connexion/Inscription
- ✅ Dashboard
- ✅ Projets
- ✅ Profil

## 🐛 Dépannage

### **Si l'inscription échoue**
- Vérifiez que l'email n'existe pas déjà
- Assurez-vous que les mots de passe correspondent
- Vérifiez que tous les champs sont remplis

### **Si la connexion échoue**
- Vérifiez que l'utilisateur existe
- Vérifiez le mot de passe
- Utilisez "Test Base de Données" pour voir les utilisateurs

### **Si l'app ne compile pas**
- Vérifiez que tous les fichiers sont sauvegardés
- Clean/Rebuild le projet dans Android Studio

## 🎉 Résultat Attendu

Après avoir suivi ces étapes, vous devriez avoir :
- ✅ Un compte utilisateur créé et connecté
- ✅ Une base de données locale avec vos données
- ✅ Une application fonctionnelle sur votre téléphone
- ✅ Un système d'authentification sécurisé

**Votre application est maintenant prête à être utilisée ! 🚀** 