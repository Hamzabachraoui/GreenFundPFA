# Configuration Guide - CrowdfundPro Mobile

## 🚀 Configuration Initiale

### 1. Prérequis Système

#### Android Studio
- Version : Arctic Fox (2020.3.1) ou plus récent
- Plugin Kotlin : Activé
- Plugin Jetpack Compose : Activé

#### SDK Android
- API Level : 24+ (Android 7.0)
- Build Tools : 34.0.0+
- Platform Tools : 34.0.0+

#### Kotlin
- Version : 1.8+
- Compiler : 1.8+

### 2. Configuration du Projet

#### Fichier `build.gradle.kts` (App Level)
```kotlin
plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.kotlinAndroid)
    id("org.jetbrains.kotlin.plugin.serialization") version "2.0.0"
}

android {
    namespace = "com.example.myapplication"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.myapplication"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    
    buildFeatures {
        compose = true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = "2.0.0"
    }
}
```

#### Dépendances Principales
```kotlin
dependencies {
    // Compose
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    
    // Navigation
    implementation(libs.androidx.navigation.compose)
    
    // ViewModel
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    
    // DataStore
    implementation(libs.androidx.datastore.preferences)
    
    // Coroutines
    implementation(libs.kotlinx.coroutines.android)
    
    // Serialization
    implementation(libs.kotlinx.serialization.json)
    
    // Coil (Images)
    implementation(libs.coil.compose)
}
```

### 3. Configuration de la Base de Données

#### DatabaseHelper.kt
```kotlin
class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {
    companion object {
        private const val DATABASE_NAME = "crowdfundpro.db"
        private const val DATABASE_VERSION = 1
    }
    
    override fun onCreate(db: SQLiteDatabase) {
        // Création des tables
        db.execSQL(CREATE_USERS_TABLE)
        db.execSQL(CREATE_PROJECTS_TABLE)
        db.execSQL(CREATE_INVESTMENTS_TABLE)
        db.execSQL(CREATE_TOKENS_TABLE)
    }
}
```

#### Tables SQLite
```sql
-- Table Utilisateurs
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nom TEXT,
    role TEXT NOT NULL,
    date_joined TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    telephone TEXT,
    adresse TEXT
);

-- Table Projets
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    description TEXT,
    objectif REAL NOT NULL,
    montant_actuel REAL DEFAULT 0,
    date_creation TEXT NOT NULL,
    date_limite TEXT,
    statut TEXT DEFAULT 'en_cours',
    porteur_id INTEGER,
    latitude REAL,
    longitude REAL,
    image_url TEXT,
    business_plan_url TEXT,
    FOREIGN KEY (porteur_id) REFERENCES users (id)
);

-- Table Investissements
CREATE TABLE investments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projet_id INTEGER NOT NULL,
    investisseur_id INTEGER NOT NULL,
    montant REAL NOT NULL,
    date_investissement TEXT NOT NULL,
    statut TEXT DEFAULT 'en_attente',
    FOREIGN KEY (projet_id) REFERENCES projects (id),
    FOREIGN KEY (investisseur_id) REFERENCES users (id)
);

-- Table Tokens
CREATE TABLE tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### 4. Configuration des Services

#### AuthService.kt
```kotlin
class AuthService(private val context: Context) {
    private val databaseHelper = DatabaseHelper(context)
    private val dataStore = context.createDataStore(name = "auth_prefs")
    
    suspend fun login(email: String, password: String): Result<User> {
        // Logique d'authentification
    }
    
    suspend fun register(userData: UserRegistration): Result<User> {
        // Logique d'inscription
    }
    
    suspend fun generateToken(userId: Int): String {
        // Génération JWT
    }
}
```

#### ProjectService.kt
```kotlin
class ProjectService(private val context: Context) {
    private val databaseHelper = DatabaseHelper(context)
    
    suspend fun getAllProjects(): List<Project> {
        // Récupération des projets
    }
    
    suspend fun createProject(project: Project): Result<Project> {
        // Création de projet
    }
    
    suspend fun updateProject(project: Project): Result<Project> {
        // Mise à jour de projet
    }
}
```

### 5. Configuration des ViewModels

#### AuthViewModel.kt
```kotlin
class AuthViewModel(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _authState = MutableStateFlow<AuthState>(AuthState.Initial)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()
    
    fun login(email: String, password: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            val result = authRepository.login(email, password)
            _authState.value = when (result) {
                is Result.Success -> AuthState.Authenticated(result.data)
                is Result.Error -> AuthState.Error(result.message)
            }
        }
    }
}
```

### 6. Configuration de la Navigation

#### AppNavigation.kt
```kotlin
@Composable
fun AppNavigation(
    authViewModel: AuthViewModel,
    projectViewModel: ProjectViewModel,
    investmentViewModel: InvestmentViewModel
) {
    val navController = rememberNavController()
    
    NavHost(navController = navController, startDestination = Screen.Home.route) {
        composable(Screen.Home.route) {
            HomeScreen(
                navController = navController,
                authViewModel = authViewModel,
                projectViewModel = projectViewModel
            )
        }
        // Autres routes...
    }
}
```

### 7. Configuration du Thème

#### Theme.kt
```kotlin
@Composable
fun CrowdfundProTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        DarkColorScheme
    } else {
        LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
```

### 8. Configuration des Permissions

#### AndroidManifest.xml
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
        android:maxSdkVersion="28" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" 
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.MyApplication3">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.MyApplication3"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

## 🔧 Configuration Avancée

### 1. Gestion des Erreurs

#### ErrorHandler.kt
```kotlin
sealed class AppError : Exception() {
    object NetworkError : AppError()
    object DatabaseError : AppError()
    object ValidationError : AppError()
    object AuthenticationError : AppError()
    data class ServerError(val code: Int, val message: String) : AppError()
}

fun handleError(error: AppError): String {
    return when (error) {
        is AppError.NetworkError -> "Erreur de connexion"
        is AppError.DatabaseError -> "Erreur de base de données"
        is AppError.ValidationError -> "Données invalides"
        is AppError.AuthenticationError -> "Authentification échouée"
        is AppError.ServerError -> "Erreur serveur: ${error.message}"
    }
}
```

### 2. Configuration des Tests

#### build.gradle.kts
```kotlin
dependencies {
    // Tests Unitaires
    testImplementation(libs.junit)
    testImplementation(libs.mockk)
    testImplementation(libs.coroutines.test)
    
    // Tests d'Interface
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
}
```

### 3. Configuration de Build

#### Variants de Build
```kotlin
android {
    buildTypes {
        debug {
            isDebuggable = true
            isMinifyEnabled = false
        }
        release {
            isDebuggable = false
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    
    flavorDimensions += "environment"
    productFlavors {
        create("development") {
            dimension = "environment"
            applicationIdSuffix = ".dev"
            versionNameSuffix = "-dev"
        }
        create("production") {
            dimension = "environment"
        }
    }
}
```

## 🚀 Déploiement

### 1. Build de Production
```bash
# Build APK
./gradlew assembleRelease

# Build Bundle (Google Play)
./gradlew bundleRelease
```

### 2. Signature de l'APK
```bash
# Générer keystore
keytool -genkey -v -keystore crowdfundpro.keystore -alias crowdfundpro -keyalg RSA -keysize 2048 -validity 10000

# Signer APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore crowdfundpro.keystore app-release-unsigned.apk crowdfundpro
```

### 3. Configuration Google Play
1. Créer un compte développeur
2. Configurer la fiche d'application
3. Uploader l'APK/Bundle
4. Configurer les métadonnées
5. Publier en production

## 🔍 Debugging

### 1. Logs de Debug
```kotlin
private const val TAG = "CrowdfundPro"

fun logDebug(message: String) {
    if (BuildConfig.DEBUG) {
        Log.d(TAG, message)
    }
}
```

### 2. Configuration ProGuard
```proguard
# Règles pour Compose
-keep class androidx.compose.** { *; }
-keepclassmembers class androidx.compose.** { *; }

# Règles pour SQLite
-keep class org.sqlite.** { *; }

# Règles pour Coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
```

## 📊 Monitoring

### 1. Analytics
```kotlin
// Intégration Firebase Analytics
implementation 'com.google.firebase:firebase-analytics-ktx:21.3.0'
```

### 2. Crash Reporting
```kotlin
// Intégration Firebase Crashlytics
implementation 'com.google.firebase:firebase-crashlytics-ktx:18.4.3'
```

---

**Configuration terminée ! Votre application mobile CrowdfundPro est prête à être développée et déployée. 🚀** 