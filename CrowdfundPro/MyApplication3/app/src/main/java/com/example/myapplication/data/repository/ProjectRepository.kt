package com.example.myapplication.data.repository

import android.content.Context
import com.example.myapplication.backend.service.ProjectService
import com.example.myapplication.data.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ProjectRepository(private val context: Context) {
    
    private val projectService = ProjectService(context)
    
    suspend fun getAllProjects(
        search: String? = null,
        statut: String? = null,
        ordering: String? = null
    ): Result<List<Project>> = withContext(Dispatchers.IO) {
        try {
            val projects = projectService.getAllProjects(search, statut, ordering)
            Result.success(projects)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getProjectById(id: Int): Result<Project> = withContext(Dispatchers.IO) {
        try {
            val project = projectService.getProjectById(id)
            if (project != null) {
                Result.success(project)
            } else {
                Result.failure(Exception("Projet non trouvé"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun createProject(request: ProjectCreateRequest, porteurId: Int): Result<Project> = withContext(Dispatchers.IO) {
        try {
            val project = projectService.createProject(request, porteurId)
            if (project != null) {
                Result.success(project)
            } else {
                Result.failure(Exception("Erreur lors de la création du projet"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun updateProject(id: Int, request: ProjectCreateRequest): Result<Project> = withContext(Dispatchers.IO) {
        try {
            val project = projectService.updateProject(id, request)
            if (project != null) {
                Result.success(project)
            } else {
                Result.failure(Exception("Erreur lors de la mise à jour du projet"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun deleteProject(id: Int): Result<Boolean> = withContext(Dispatchers.IO) {
        try {
            val success = projectService.deleteProject(id)
            if (success) {
                Result.success(true)
            } else {
                Result.failure(Exception("Erreur lors de la suppression du projet"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUserProjects(userId: Int): Result<List<Project>> = withContext(Dispatchers.IO) {
        try {
            val projects = projectService.getUserProjects(userId)
            Result.success(projects)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getProjectStats(): Result<ProjectStats> = withContext(Dispatchers.IO) {
        try {
            val stats = projectService.getProjectStats()
            Result.success(stats)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun updateProjectStatus(projectId: Int, newStatus: ProjectStatus): Result<Project> = withContext(Dispatchers.IO) {
        try {
            val project = projectService.updateProjectStatus(projectId, newStatus)
            if (project != null) {
                Result.success(project)
            } else {
                Result.failure(Exception("Erreur lors de la mise à jour du statut"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
} 