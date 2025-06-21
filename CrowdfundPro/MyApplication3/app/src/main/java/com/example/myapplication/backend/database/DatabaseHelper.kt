package com.example.myapplication.backend.database

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import com.example.myapplication.data.model.*
import java.text.SimpleDateFormat
import java.util.*

class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "crowdfundpro.db"
        private const val DATABASE_VERSION = 1

        // Tables
        private const val TABLE_USERS = "users"
        private const val TABLE_PROJECTS = "projects"
        private const val TABLE_INVESTMENTS = "investments"
        private const val TABLE_TOKENS = "tokens"
    }

    override fun onCreate(db: SQLiteDatabase) {
        println("DEBUG: Création des tables de la base de données")
        createTables(db)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        println("DEBUG: Mise à jour de la base de données de $oldVersion vers $newVersion")
        // Gérer les migrations de base de données
        db.execSQL("DROP TABLE IF EXISTS $TABLE_USERS")
        db.execSQL("DROP TABLE IF EXISTS $TABLE_PROJECTS")
        db.execSQL("DROP TABLE IF EXISTS $TABLE_INVESTMENTS")
        db.execSQL("DROP TABLE IF EXISTS $TABLE_TOKENS")
        onCreate(db)
    }

    private fun createTables(db: SQLiteDatabase) {
        // Table Users (avec mot de passe hashé)
        val createUsersTable = """
            CREATE TABLE IF NOT EXISTS $TABLE_USERS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                username TEXT NOT NULL,
                nom TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'INVESTISSEUR',
                date_inscription TEXT NOT NULL,
                telephone TEXT,
                adresse TEXT,
                is_active INTEGER NOT NULL DEFAULT 1
            )
        """.trimIndent()

        // Table Projects (simplifiée)
        val createProjectsTable = """
            CREATE TABLE IF NOT EXISTS $TABLE_PROJECTS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titre TEXT NOT NULL,
                description TEXT NOT NULL,
                objectif REAL NOT NULL,
                montant_actuel REAL NOT NULL DEFAULT 0.0,
                date_creation TEXT NOT NULL,
                date_limite TEXT NOT NULL,
                statut TEXT NOT NULL DEFAULT 'EN_ATTENTE_VALIDATION',
                image TEXT,
                porteur_id INTEGER NOT NULL,
                nombre_investisseurs INTEGER NOT NULL DEFAULT 0,
                pourcentage_finance REAL NOT NULL DEFAULT 0.0,
                montant_cible REAL NOT NULL DEFAULT 0.0,
                latitude REAL,
                longitude REAL,
                adresse TEXT,
                a_localisation INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (porteur_id) REFERENCES $TABLE_USERS (id)
            )
        """.trimIndent()

        // Table Investments (simplifiée)
        val createInvestmentsTable = """
            CREATE TABLE IF NOT EXISTS $TABLE_INVESTMENTS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                projet_id INTEGER NOT NULL,
                investisseur_id INTEGER NOT NULL,
                montant REAL NOT NULL,
                date_investissement TEXT NOT NULL,
                statut TEXT NOT NULL DEFAULT 'EN_ATTENTE',
                FOREIGN KEY (projet_id) REFERENCES $TABLE_PROJECTS (id),
                FOREIGN KEY (investisseur_id) REFERENCES $TABLE_USERS (id)
            )
        """.trimIndent()

        // Table Tokens (pour l'authentification JWT)
        val createTokensTable = """
            CREATE TABLE IF NOT EXISTS $TABLE_TOKENS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                access_token TEXT NOT NULL,
                refresh_token TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES $TABLE_USERS (id)
            )
        """.trimIndent()

        try {
            db.execSQL(createUsersTable)
            db.execSQL(createProjectsTable)
            db.execSQL(createInvestmentsTable)
            db.execSQL(createTokensTable)
            println("DEBUG: Tables créées avec succès")
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la création des tables: ${e.message}")
        }
    }

    // Méthodes pour les utilisateurs
    fun createUser(user: User, passwordHash: String): Long {
        try {
            val db = this.writableDatabase
            val values = ContentValues().apply {
                put("email", user.email)
                put("username", user.username)
                put("nom", user.nom)
                put("password_hash", passwordHash)
                put("role", user.role.name)
                put("date_inscription", user.dateInscription)
                put("telephone", user.telephone)
                put("adresse", user.adresse)
                put("is_active", if (user.isActive) 1 else 0)
            }
            val result = db.insert(TABLE_USERS, null, values)
            println("DEBUG: Utilisateur créé avec ID: $result")
            return result
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la création de l'utilisateur: ${e.message}")
            return -1
        }
    }

    fun getUserByEmail(email: String): User? {
        try {
            val db = this.readableDatabase
            val cursor = db.query(
                TABLE_USERS,
                null,
                "email = ?",
                arrayOf(email),
                null,
                null,
                null
            )

            return if (cursor.moveToFirst()) {
                val user = User(
                    id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
                    email = cursor.getString(cursor.getColumnIndexOrThrow("email")),
                    username = cursor.getString(cursor.getColumnIndexOrThrow("username")),
                    nom = cursor.getString(cursor.getColumnIndexOrThrow("nom")),
                    role = UserRole.valueOf(cursor.getString(cursor.getColumnIndexOrThrow("role"))),
                    dateInscription = cursor.getString(cursor.getColumnIndexOrThrow("date_inscription")),
                    telephone = cursor.getString(cursor.getColumnIndexOrThrow("telephone")),
                    adresse = cursor.getString(cursor.getColumnIndexOrThrow("adresse")),
                    isActive = cursor.getInt(cursor.getColumnIndexOrThrow("is_active")) == 1
                )
                cursor.close()
                println("DEBUG: Utilisateur trouvé: ${user.email}")
                user
            } else {
                cursor.close()
                println("DEBUG: Aucun utilisateur trouvé pour l'email: $email")
                null
            }
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la recherche de l'utilisateur: ${e.message}")
            return null
        }
    }

    fun verifyPassword(email: String, passwordHash: String): Boolean {
        try {
            val db = this.readableDatabase
            val cursor = db.query(
                TABLE_USERS,
                arrayOf("password_hash"),
                "email = ?",
                arrayOf(email),
                null,
                null,
                null
            )

            return if (cursor.moveToFirst()) {
                val storedHash = cursor.getString(cursor.getColumnIndexOrThrow("password_hash"))
                cursor.close()
                storedHash == passwordHash
            } else {
                cursor.close()
                false
            }
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la vérification du mot de passe: ${e.message}")
            return false
        }
    }

    fun getAllUsers(): List<User> {
        val users = mutableListOf<User>()
        try {
            val db = this.readableDatabase
            val cursor = db.query(
                TABLE_USERS,
                null,
                null,
                null,
                null,
                null,
                "id ASC"
            )

            while (cursor.moveToNext()) {
                val user = User(
                    id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
                    email = cursor.getString(cursor.getColumnIndexOrThrow("email")),
                    username = cursor.getString(cursor.getColumnIndexOrThrow("username")),
                    nom = cursor.getString(cursor.getColumnIndexOrThrow("nom")),
                    role = UserRole.valueOf(cursor.getString(cursor.getColumnIndexOrThrow("role"))),
                    dateInscription = cursor.getString(cursor.getColumnIndexOrThrow("date_inscription")),
                    telephone = cursor.getString(cursor.getColumnIndexOrThrow("telephone")),
                    adresse = cursor.getString(cursor.getColumnIndexOrThrow("adresse")),
                    isActive = cursor.getInt(cursor.getColumnIndexOrThrow("is_active")) == 1
                )
                users.add(user)
            }
            cursor.close()
            println("DEBUG: ${users.size} utilisateurs récupérés")
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la récupération des utilisateurs: ${e.message}")
        }
        return users
    }

    fun getUserById(id: Int): User? {
        try {
            val db = this.readableDatabase
            val cursor = db.query(
                TABLE_USERS,
                null,
                "id = ?",
                arrayOf(id.toString()),
                null,
                null,
                null
            )

            return if (cursor.moveToFirst()) {
                val user = User(
                    id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
                    email = cursor.getString(cursor.getColumnIndexOrThrow("email")),
                    username = cursor.getString(cursor.getColumnIndexOrThrow("username")),
                    nom = cursor.getString(cursor.getColumnIndexOrThrow("nom")),
                    role = UserRole.valueOf(cursor.getString(cursor.getColumnIndexOrThrow("role"))),
                    dateInscription = cursor.getString(cursor.getColumnIndexOrThrow("date_inscription")),
                    telephone = cursor.getString(cursor.getColumnIndexOrThrow("telephone")),
                    adresse = cursor.getString(cursor.getColumnIndexOrThrow("adresse")),
                    isActive = cursor.getInt(cursor.getColumnIndexOrThrow("is_active")) == 1
                )
                cursor.close()
                user
            } else {
                cursor.close()
                null
            }
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la recherche de l'utilisateur par ID: ${e.message}")
            return null
        }
    }

    // Méthodes pour les projets
    fun createProject(project: Project): Long {
        try {
            val db = this.writableDatabase
            val values = ContentValues().apply {
                put("titre", project.titre)
                put("description", project.description)
                put("objectif", project.objectif)
                put("date_creation", project.dateCreation)
                put("date_limite", project.dateLimite)
                put("statut", project.statut.name)
                put("image", project.image)
                put("porteur_id", project.porteur.id)
                put("montant_actuel", project.montantActuel)
                put("pourcentage_finance", project.pourcentageFinance)
                put("nombre_investisseurs", project.nombreInvestisseurs)
                put("montant_cible", project.montantCible)
                put("latitude", project.latitude)
                put("longitude", project.longitude)
                put("adresse", project.adresse)
                put("a_localisation", if (project.aLocalisation) 1 else 0)
            }
            val result = db.insert(TABLE_PROJECTS, null, values)
            println("DEBUG: Projet créé avec ID: $result")
            return result
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la création du projet: ${e.message}")
            return -1
        }
    }

    fun getAllProjects(): List<Project> {
        val projects = mutableListOf<Project>()
        try {
            val db = this.readableDatabase
            val cursor = db.query(
                TABLE_PROJECTS,
                null,
                null,
                null,
                null,
                null,
                "date_creation DESC"
            )

            while (cursor.moveToNext()) {
                val projectId = cursor.getInt(cursor.getColumnIndexOrThrow("id"))
                val porteurId = cursor.getInt(cursor.getColumnIndexOrThrow("porteur_id"))
                val porteur = getUserById(porteurId)
                
                if (porteur != null) {
                    val project = Project(
                        id = projectId,
                        titre = cursor.getString(cursor.getColumnIndexOrThrow("titre")),
                        description = cursor.getString(cursor.getColumnIndexOrThrow("description")),
                        objectif = cursor.getDouble(cursor.getColumnIndexOrThrow("objectif")),
                        montantActuel = cursor.getDouble(cursor.getColumnIndexOrThrow("montant_actuel")),
                        dateCreation = cursor.getString(cursor.getColumnIndexOrThrow("date_creation")),
                        dateLimite = cursor.getString(cursor.getColumnIndexOrThrow("date_limite")),
                        statut = ProjectStatus.valueOf(cursor.getString(cursor.getColumnIndexOrThrow("statut"))),
                        statutDisplay = getStatusDisplay(cursor.getString(cursor.getColumnIndexOrThrow("statut"))),
                        image = cursor.getString(cursor.getColumnIndexOrThrow("image")),
                        porteur = porteur,
                        nombreInvestisseurs = cursor.getInt(cursor.getColumnIndexOrThrow("nombre_investisseurs")),
                        pourcentageFinance = cursor.getDouble(cursor.getColumnIndexOrThrow("pourcentage_finance")),
                        montantCible = cursor.getDouble(cursor.getColumnIndexOrThrow("montant_cible")),
                        latitude = cursor.getDouble(cursor.getColumnIndexOrThrow("latitude")),
                        longitude = cursor.getDouble(cursor.getColumnIndexOrThrow("longitude")),
                        adresse = cursor.getString(cursor.getColumnIndexOrThrow("adresse")),
                        aLocalisation = cursor.getInt(cursor.getColumnIndexOrThrow("a_localisation")) == 1
                    )
                    projects.add(project)
                }
            }
            cursor.close()
            println("DEBUG: ${projects.size} projets récupérés")
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la récupération des projets: ${e.message}")
        }
        return projects
    }

    fun getProjectById(id: Int): Project? {
        try {
            val db = this.readableDatabase
            val cursor = db.query(
                TABLE_PROJECTS,
                null,
                "id = ?",
                arrayOf(id.toString()),
                null,
                null,
                null
            )

            return if (cursor.moveToFirst()) {
                val porteurId = cursor.getInt(cursor.getColumnIndexOrThrow("porteur_id"))
                val porteur = getUserById(porteurId)
                
                if (porteur != null) {
                    val project = Project(
                        id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
                        titre = cursor.getString(cursor.getColumnIndexOrThrow("titre")),
                        description = cursor.getString(cursor.getColumnIndexOrThrow("description")),
                        objectif = cursor.getDouble(cursor.getColumnIndexOrThrow("objectif")),
                        montantActuel = cursor.getDouble(cursor.getColumnIndexOrThrow("montant_actuel")),
                        dateCreation = cursor.getString(cursor.getColumnIndexOrThrow("date_creation")),
                        dateLimite = cursor.getString(cursor.getColumnIndexOrThrow("date_limite")),
                        statut = ProjectStatus.valueOf(cursor.getString(cursor.getColumnIndexOrThrow("statut"))),
                        statutDisplay = getStatusDisplay(cursor.getString(cursor.getColumnIndexOrThrow("statut"))),
                        image = cursor.getString(cursor.getColumnIndexOrThrow("image")),
                        porteur = porteur,
                        nombreInvestisseurs = cursor.getInt(cursor.getColumnIndexOrThrow("nombre_investisseurs")),
                        pourcentageFinance = cursor.getDouble(cursor.getColumnIndexOrThrow("pourcentage_finance")),
                        montantCible = cursor.getDouble(cursor.getColumnIndexOrThrow("montant_cible")),
                        latitude = cursor.getDouble(cursor.getColumnIndexOrThrow("latitude")),
                        longitude = cursor.getDouble(cursor.getColumnIndexOrThrow("longitude")),
                        adresse = cursor.getString(cursor.getColumnIndexOrThrow("adresse")),
                        aLocalisation = cursor.getInt(cursor.getColumnIndexOrThrow("a_localisation")) == 1
                    )
                    cursor.close()
                    project
                } else {
                    cursor.close()
                    null
                }
            } else {
                cursor.close()
                null
            }
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la recherche du projet: ${e.message}")
            return null
        }
    }

    // Méthodes pour les investissements
    fun createInvestment(investment: Investment): Long {
        try {
            val db = this.writableDatabase
            val values = ContentValues().apply {
                put("projet_id", investment.projet.id)
                put("investisseur_id", investment.investisseur.id)
                put("montant", investment.montant)
                put("date_investissement", investment.dateInvestissement)
                put("statut", investment.statut.name)
            }
            val result = db.insert(TABLE_INVESTMENTS, null, values)
            println("DEBUG: Investissement créé avec ID: $result")
            return result
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la création de l'investissement: ${e.message}")
            return -1
        }
    }

    fun getInvestmentsByUser(userId: Int): List<Investment> {
        val investments = mutableListOf<Investment>()
        try {
            val db = this.readableDatabase
            val cursor = db.query(
                TABLE_INVESTMENTS,
                null,
                "investisseur_id = ?",
                arrayOf(userId.toString()),
                null,
                null,
                "date_investissement DESC"
            )

            while (cursor.moveToNext()) {
                val projetId = cursor.getInt(cursor.getColumnIndexOrThrow("projet_id"))
                val investisseurId = cursor.getInt(cursor.getColumnIndexOrThrow("investisseur_id"))
                val projet = getProjectById(projetId)
                val investisseur = getUserById(investisseurId)
                
                if (projet != null && investisseur != null) {
                    val investment = Investment(
                        id = cursor.getInt(cursor.getColumnIndexOrThrow("id")),
                        projet = projet,
                        investisseur = investisseur,
                        montant = cursor.getDouble(cursor.getColumnIndexOrThrow("montant")),
                        dateInvestissement = cursor.getString(cursor.getColumnIndexOrThrow("date_investissement")),
                        statut = InvestmentStatus.valueOf(cursor.getString(cursor.getColumnIndexOrThrow("statut"))),
                        statutDisplay = getInvestmentStatusDisplay(cursor.getString(cursor.getColumnIndexOrThrow("statut")))
                    )
                    investments.add(investment)
                }
            }
            cursor.close()
            println("DEBUG: ${investments.size} investissements récupérés pour l'utilisateur $userId")
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la récupération des investissements: ${e.message}")
        }
        return investments
    }

    // Méthodes pour les tokens
    fun saveToken(userId: Int, accessToken: String, refreshToken: String) {
        try {
            val db = this.writableDatabase
            val values = ContentValues().apply {
                put("user_id", userId)
                put("access_token", accessToken)
                put("refresh_token", refreshToken)
                put("created_at", SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date()))
                put("expires_at", SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date(System.currentTimeMillis() + 60 * 60 * 1000))) // 1 heure
            }
            val result = db.insert(TABLE_TOKENS, null, values)
            println("DEBUG: Token sauvegardé avec ID: $result")
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la sauvegarde du token: ${e.message}")
        }
    }

    fun getTokenByUserId(userId: Int): Pair<String, String>? {
        try {
            val db = this.readableDatabase
            val cursor = db.query(
                TABLE_TOKENS,
                null,
                "user_id = ?",
                arrayOf(userId.toString()),
                null,
                null,
                "created_at DESC",
                "1"
            )

            return if (cursor.moveToFirst()) {
                val accessToken = cursor.getString(cursor.getColumnIndexOrThrow("access_token"))
                val refreshToken = cursor.getString(cursor.getColumnIndexOrThrow("refresh_token"))
                cursor.close()
                Pair(accessToken, refreshToken)
            } else {
                cursor.close()
                null
            }
        } catch (e: Exception) {
            println("DEBUG: Erreur lors de la récupération du token: ${e.message}")
            return null
        }
    }

    // Utilitaires
    private fun getStatusDisplay(status: String): String {
        return when (status) {
            "EN_ATTENTE_VALIDATION" -> "En attente de validation"
            "EN_COURS" -> "En cours"
            "FINANCE" -> "Financé"
            "ECHOUE" -> "Échoué"
            else -> status
        }
    }

    private fun getInvestmentStatusDisplay(status: String): String {
        return when (status) {
            "EN_ATTENTE" -> "En attente"
            "VALIDE" -> "Validé"
            "REFUSE" -> "Refusé"
            else -> status
        }
    }
} 