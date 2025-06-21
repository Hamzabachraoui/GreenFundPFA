package com.example.myapplication.backend.service

import android.content.Context
import com.example.myapplication.backend.database.DatabaseHelper
import com.example.myapplication.data.model.*
import java.text.SimpleDateFormat
import java.util.*

class ProjectService(private val context: Context) {
    
    private val databaseHelper = DatabaseHelper(context)
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
    
    fun getAllProjects(
        search: String? = null,
        statut: String? = null,
        ordering: String? = null
    ): List<Project> {
        var projects = databaseHelper.getAllProjects()
        
        // Filtrage par recherche
        if (!search.isNullOrBlank()) {
            projects = projects.filter { project ->
                project.titre.contains(search, ignoreCase = true) ||
                project.description.contains(search, ignoreCase = true)
            }
        }
        
        // Filtrage par statut
        if (!statut.isNullOrBlank()) {
            projects = projects.filter { project ->
                project.statut.name == statut
            }
        }
        
        // Tri
        projects = when (ordering) {
            "date_creation" -> projects.sortedBy { it.dateCreation }
            "-date_creation" -> projects.sortedByDescending { it.dateCreation }
            "objectif" -> projects.sortedBy { it.objectif }
            "-objectif" -> projects.sortedByDescending { it.objectif }
            "-pourcentage_finance" -> projects.sortedByDescending { it.pourcentageFinance }
            else -> projects.sortedByDescending { it.dateCreation }
        }
        
        return projects
    }
    
    fun getProjectById(id: Int): Project? {
        return databaseHelper.getProjectById(id)
    }
    
    fun createProject(request: ProjectCreateRequest, porteurId: Int): Project? {
        val porteur = databaseHelper.getUserById(porteurId)
        if (porteur == null) return null
        
        val project = Project(
            id = 0,
            titre = request.titre,
            description = request.description,
            objectif = request.objectif,
            montantActuel = 0.0,
            dateCreation = dateFormat.format(Date()),
            dateLimite = request.dateLimite,
            statut = ProjectStatus.EN_ATTENTE_VALIDATION,
            statutDisplay = "En attente de validation",
            porteur = porteur,
            nombreInvestisseurs = 0,
            pourcentageFinance = 0.0,
            montantCible = request.objectif,
            latitude = request.latitude,
            longitude = request.longitude,
            adresse = request.adresse,
            aLocalisation = request.latitude != null && request.longitude != null
        )
        
        val projectId = databaseHelper.createProject(project)
        if (projectId > 0) {
            return project.copy(id = projectId.toInt())
        }
        return null
    }
    
    fun updateProject(id: Int, request: ProjectCreateRequest): Project? {
        val existingProject = databaseHelper.getProjectById(id)
        if (existingProject == null) return null
        
        val updatedProject = existingProject.copy(
            titre = request.titre,
            description = request.description,
            objectif = request.objectif,
            dateLimite = request.dateLimite,
            latitude = request.latitude,
            longitude = request.longitude,
            adresse = request.adresse,
            aLocalisation = request.latitude != null && request.longitude != null
        )
        
        // Mettre à jour dans la base de données
        // Note: Cette implémentation simplifiée ne met pas à jour la base de données
        // Dans une vraie application, vous ajouteriez une méthode updateProject dans DatabaseHelper
        return updatedProject
    }
    
    fun deleteProject(id: Int): Boolean {
        // Note: Cette implémentation simplifiée ne supprime pas de la base de données
        // Dans une vraie application, vous ajouteriez une méthode deleteProject dans DatabaseHelper
        return true
    }
    
    fun getUserProjects(userId: Int): List<Project> {
        return databaseHelper.getAllProjects().filter { it.porteur.id == userId }
    }
    
    fun getProjectStats(): ProjectStats {
        val projects = databaseHelper.getAllProjects()
        
        val total = projects.size
        val enCours = projects.count { it.statut == ProjectStatus.EN_COURS }
        val finance = projects.count { it.statut == ProjectStatus.FINANCE }
        val echoue = projects.count { it.statut == ProjectStatus.ECHOUE }
        val montantTotal = projects.sumOf { it.montantActuel }
        val montantMoyen = if (projects.isNotEmpty()) montantTotal / projects.size else 0.0
        
        return ProjectStats(
            total = total,
            enCours = enCours,
            finance = finance,
            echoue = echoue,
            montantTotal = montantTotal,
            montantMoyen = montantMoyen
        )
    }
    
    fun updateProjectStatus(projectId: Int, newStatus: ProjectStatus): Project? {
        val project = databaseHelper.getProjectById(projectId)
        if (project == null) return null
        
        val updatedProject = project.copy(
            statut = newStatus,
            statutDisplay = getStatusDisplay(newStatus.name)
        )
        
        // Mettre à jour dans la base de données
        // Note: Cette implémentation simplifiée ne met pas à jour la base de données
        return updatedProject
    }
    
    private fun getStatusDisplay(status: String): String {
        return when (status) {
            "EN_ATTENTE_VALIDATION" -> "En attente de validation"
            "EN_COURS" -> "En cours"
            "FINANCE" -> "Financé"
            "ECHOUE" -> "Échoué"
            else -> status
        }
    }
} 