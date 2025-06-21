package com.example.myapplication.backend.database

import android.content.Context
import com.example.myapplication.data.model.*
import java.security.MessageDigest
import java.text.SimpleDateFormat
import java.util.*

class DatabaseInitializer(private val context: Context) {
    
    private val databaseHelper = DatabaseHelper(context)
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
    
    fun initializeDatabase() {
        println("DEBUG: ===== DÉBUT INITIALISATION BASE DE DONNÉES =====")
        
        // Vérifier si la base de données est déjà initialisée
        val existingUsers = databaseHelper.getAllUsers()
        println("DEBUG: Utilisateurs existants: ${existingUsers.size}")
        
        if (existingUsers.isNotEmpty()) {
            println("DEBUG: Base de données déjà initialisée, arrêt de l'initialisation")
            return // Base de données déjà initialisée
        }
        
        println("DEBUG: Création des utilisateurs de test...")
        // Créer des utilisateurs de test
        val users = createTestUsers()
        println("DEBUG: ${users.size} utilisateurs créés")
        
        if (users.isNotEmpty()) {
            println("DEBUG: Création des projets de test...")
            // Créer des projets de test
            val projects = createTestProjects(users)
            println("DEBUG: ${projects.size} projets créés")
            
            if (projects.isNotEmpty()) {
                println("DEBUG: Création des investissements de test...")
                // Créer des investissements de test
                createTestInvestments(users, projects)
                println("DEBUG: Investissements créés")
            }
        }
        
        println("DEBUG: ===== FIN INITIALISATION BASE DE DONNÉES =====")
    }
    
    private fun createTestUsers(): List<User> {
        val users = mutableListOf<User>()
        
        // Utilisateur de test
        val testUser = User(
            id = 0,
            email = "test@example.com",
            username = "test",
            nom = "Utilisateur Test",
            role = UserRole.PORTEUR,
            dateInscription = dateFormat.format(Date()),
            isActive = true
        )
        val testPasswordHash = hashPassword("test123")
        val testUserId = databaseHelper.createUser(testUser, testPasswordHash)
        users.add(testUser.copy(id = testUserId.toInt()))
        
        // Utilisateur admin
        val admin = User(
            id = 0,
            email = "admin@crowdfundpro.com",
            username = "admin",
            nom = "Administrateur",
            role = UserRole.ADMIN,
            dateInscription = dateFormat.format(Date()),
            isActive = true
        )
        val adminPasswordHash = hashPassword("admin123")
        val adminId = databaseHelper.createUser(admin, adminPasswordHash)
        users.add(admin.copy(id = adminId.toInt()))
        
        // Porteurs de projets
        val porteur1 = User(
            id = 0,
            email = "porteur1@example.com",
            username = "porteur1",
            nom = "Ahmed Benali",
            role = UserRole.PORTEUR,
            dateInscription = dateFormat.format(Date()),
            telephone = "+212 6 12 34 56 78",
            adresse = "Casablanca, Maroc",
            isActive = true
        )
        val porteurPasswordHash = hashPassword("porteur123")
        val porteur1Id = databaseHelper.createUser(porteur1, porteurPasswordHash)
        users.add(porteur1.copy(id = porteur1Id.toInt()))
        
        val porteur2 = User(
            id = 0,
            email = "porteur2@example.com",
            username = "porteur2",
            nom = "Fatima Zahra",
            role = UserRole.PORTEUR,
            dateInscription = dateFormat.format(Date()),
            telephone = "+212 6 98 76 54 32",
            adresse = "Rabat, Maroc",
            isActive = true
        )
        val porteur2PasswordHash = hashPassword("porteur123")
        val porteur2Id = databaseHelper.createUser(porteur2, porteurPasswordHash)
        users.add(porteur2.copy(id = porteur2Id.toInt()))
        
        // Investisseurs
        val investisseur1 = User(
            id = 0,
            email = "investisseur1@example.com",
            username = "investisseur1",
            nom = "Mohammed Alami",
            role = UserRole.INVESTISSEUR,
            dateInscription = dateFormat.format(Date()),
            telephone = "+212 6 11 22 33 44",
            adresse = "Marrakech, Maroc",
            isActive = true
        )
        val investisseurPasswordHash = hashPassword("investisseur123")
        val investisseur1Id = databaseHelper.createUser(investisseur1, investisseurPasswordHash)
        users.add(investisseur1.copy(id = investisseur1Id.toInt()))
        
        val investisseur2 = User(
            id = 0,
            email = "investisseur2@example.com",
            username = "investisseur2",
            nom = "Amina Tazi",
            role = UserRole.INVESTISSEUR,
            dateInscription = dateFormat.format(Date()),
            telephone = "+212 6 55 66 77 88",
            adresse = "Fès, Maroc",
            isActive = true
        )
        val investisseur2Id = databaseHelper.createUser(investisseur2, investisseurPasswordHash)
        users.add(investisseur2.copy(id = investisseur2Id.toInt()))
        
        return users
    }
    
    private fun hashPassword(password: String): String {
        val bytes = MessageDigest.getInstance("SHA-256").digest(password.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }
    
    private fun createTestProjects(users: List<User>): List<Project> {
        val projects = mutableListOf<Project>()
        val porteurs = users.filter { it.role == UserRole.PORTEUR }
        
        // Projet 1: Restaurant traditionnel
        val projet1 = Project(
            id = 0,
            titre = "Restaurant Traditionnel Marocain",
            description = "Ouverture d'un restaurant authentique proposant les meilleures spécialités marocaines dans un cadre traditionnel. Notre restaurant offrira une expérience culinaire unique avec des recettes transmises de génération en génération.",
            objectif = 500000.0,
            montantActuel = 125000.0,
            dateCreation = dateFormat.format(Date()),
            dateLimite = "2024-12-31T23:59:59.000Z",
            statut = ProjectStatus.EN_COURS,
            statutDisplay = "En cours",
            image = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
            porteur = porteurs[0],
            nombreInvestisseurs = 15,
            pourcentageFinance = 25.0,
            montantCible = 500000.0,
            latitude = 33.5731,
            longitude = -7.5898,
            adresse = "Casablanca, Maroc",
            aLocalisation = true
        )
        val projet1Id = databaseHelper.createProject(projet1)
        projects.add(projet1.copy(id = projet1Id.toInt()))
        
        // Projet 2: Application mobile
        val projet2 = Project(
            id = 0,
            titre = "App Mobile pour Artisans",
            description = "Développement d'une application mobile permettant aux artisans marocains de vendre leurs produits en ligne. L'application inclura un système de paiement sécurisé et une logistique optimisée.",
            objectif = 300000.0,
            montantActuel = 75000.0,
            dateCreation = dateFormat.format(Date()),
            dateLimite = "2024-11-30T23:59:59.000Z",
            statut = ProjectStatus.EN_COURS,
            statutDisplay = "En cours",
            image = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
            porteur = porteurs[1],
            nombreInvestisseurs = 8,
            pourcentageFinance = 25.0,
            montantCible = 300000.0,
            latitude = 34.0209,
            longitude = -6.8416,
            adresse = "Rabat, Maroc",
            aLocalisation = true
        )
        val projet2Id = databaseHelper.createProject(projet2)
        projects.add(projet2.copy(id = projet2Id.toInt()))
        
        // Projet 3: Énergie solaire
        val projet3 = Project(
            id = 0,
            titre = "Installation Solaire Rurale",
            description = "Installation de panneaux solaires dans les villages ruraux pour fournir de l'électricité propre et abordable. Ce projet contribuera au développement durable et à l'amélioration de la qualité de vie.",
            objectif = 800000.0,
            montantActuel = 0.0,
            dateCreation = dateFormat.format(Date()),
            dateLimite = "2025-02-28T23:59:59.000Z",
            statut = ProjectStatus.EN_ATTENTE_VALIDATION,
            statutDisplay = "En attente de validation",
            image = "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
            porteur = porteurs[0],
            nombreInvestisseurs = 0,
            pourcentageFinance = 0.0,
            montantCible = 800000.0,
            latitude = 31.6295,
            longitude = -7.9811,
            adresse = "Marrakech, Maroc",
            aLocalisation = true
        )
        val projet3Id = databaseHelper.createProject(projet3)
        projects.add(projet3.copy(id = projet3Id.toInt()))
        
        // Projet 4: Projet financé
        val projet4 = Project(
            id = 0,
            titre = "Boutique de Mode Éthique",
            description = "Création d'une boutique de mode éthique proposant des vêtements fabriqués par des artisans locaux avec des matériaux durables. Notre mission est de promouvoir la mode responsable.",
            objectif = 200000.0,
            montantActuel = 200000.0,
            dateCreation = dateFormat.format(Date()),
            dateLimite = "2024-10-15T23:59:59.000Z",
            statut = ProjectStatus.FINANCE,
            statutDisplay = "Financé",
            image = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
            porteur = porteurs[1],
            nombreInvestisseurs = 25,
            pourcentageFinance = 100.0,
            montantCible = 200000.0,
            latitude = 34.0209,
            longitude = -6.8416,
            adresse = "Rabat, Maroc",
            aLocalisation = true
        )
        val projet4Id = databaseHelper.createProject(projet4)
        projects.add(projet4.copy(id = projet4Id.toInt()))
        
        return projects
    }
    
    private fun createTestInvestments(users: List<User>, projects: List<Project>) {
        val investisseurs = users.filter { it.role == UserRole.INVESTISSEUR }
        
        // Investissements pour le projet 1
        val investissement1 = Investment(
            id = 0,
            projet = projects[0],
            investisseur = investisseurs[0],
            montant = 50000.0,
            dateInvestissement = dateFormat.format(Date()),
            statut = InvestmentStatus.VALIDE,
            statutDisplay = "Validé"
        )
        databaseHelper.createInvestment(investissement1)
        
        val investissement2 = Investment(
            id = 0,
            projet = projects[0],
            investisseur = investisseurs[1],
            montant = 75000.0,
            dateInvestissement = dateFormat.format(Date()),
            statut = InvestmentStatus.VALIDE,
            statutDisplay = "Validé"
        )
        databaseHelper.createInvestment(investissement2)
        
        // Investissements pour le projet 2
        val investissement3 = Investment(
            id = 0,
            projet = projects[1],
            investisseur = investisseurs[0],
            montant = 40000.0,
            dateInvestissement = dateFormat.format(Date()),
            statut = InvestmentStatus.VALIDE,
            statutDisplay = "Validé"
        )
        databaseHelper.createInvestment(investissement3)
        
        val investissement4 = Investment(
            id = 0,
            projet = projects[1],
            investisseur = investisseurs[1],
            montant = 35000.0,
            dateInvestissement = dateFormat.format(Date()),
            statut = InvestmentStatus.VALIDE,
            statutDisplay = "Validé"
        )
        databaseHelper.createInvestment(investissement4)
        
        // Investissements pour le projet 4 (financé)
        repeat(25) { index ->
            val investissement = Investment(
                id = 0,
                projet = projects[3],
                investisseur = investisseurs[index % investisseurs.size],
                montant = 8000.0,
                dateInvestissement = dateFormat.format(Date()),
                statut = InvestmentStatus.VALIDE,
                statutDisplay = "Validé"
            )
            databaseHelper.createInvestment(investissement)
        }
    }
} 