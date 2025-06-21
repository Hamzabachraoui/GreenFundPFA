package com.example.myapplication.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.model.*
import com.example.myapplication.data.repository.ProjectRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ProjectViewModel(application: Application) : AndroidViewModel(application) {
    
    private val projectRepository = ProjectRepository(application)
    
    private val _projects = MutableStateFlow<List<Project>>(emptyList())
    val projects: StateFlow<List<Project>> = _projects.asStateFlow()
    
    private val _currentProject = MutableStateFlow<Project?>(null)
    val currentProject: StateFlow<Project?> = _currentProject.asStateFlow()
    
    private val _projectStats = MutableStateFlow<ProjectStats?>(null)
    val projectStats: StateFlow<ProjectStats?> = _projectStats.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    private val _filters = MutableStateFlow(ProjectFilters())
    val filters: StateFlow<ProjectFilters> = _filters.asStateFlow()
    
    fun loadProjects() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            val result = projectRepository.getAllProjects(
                search = _filters.value.search,
                statut = _filters.value.statut,
                ordering = _filters.value.ordering
            )
            
            result.fold(
                onSuccess = { projects ->
                    _projects.value = projects
                },
                onFailure = { exception ->
                    _error.value = exception.message ?: "Failed to load projects"
                }
            )
            
            _isLoading.value = false
        }
    }
    
    fun loadProject(id: Int) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            val result = projectRepository.getProjectById(id)
            
            result.fold(
                onSuccess = { project ->
                    _currentProject.value = project
                },
                onFailure = { exception ->
                    _error.value = exception.message ?: "Failed to load project"
                }
            )
            
            _isLoading.value = false
        }
    }
    
    fun createProject(request: ProjectCreateRequest, porteurId: Int) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            val result = projectRepository.createProject(request, porteurId)
            
            result.fold(
                onSuccess = { project ->
                    // Recharger la liste des projets
                    loadProjects()
                },
                onFailure = { exception ->
                    _error.value = exception.message ?: "Failed to create project"
                }
            )
            
            _isLoading.value = false
        }
    }
    
    fun updateProject(id: Int, request: ProjectCreateRequest) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            val result = projectRepository.updateProject(id, request)
            
            result.fold(
                onSuccess = { project ->
                    _currentProject.value = project
                    loadProjects() // Recharger la liste
                },
                onFailure = { exception ->
                    _error.value = exception.message ?: "Failed to update project"
                }
            )
            
            _isLoading.value = false
        }
    }
    
    fun deleteProject(id: Int) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            val result = projectRepository.deleteProject(id)
            
            result.fold(
                onSuccess = {
                    loadProjects() // Recharger la liste
                },
                onFailure = { exception ->
                    _error.value = exception.message ?: "Failed to delete project"
                }
            )
            
            _isLoading.value = false
        }
    }
    
    fun loadProjectStats() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            val result = projectRepository.getProjectStats()
            
            result.fold(
                onSuccess = { stats ->
                    _projectStats.value = stats
                },
                onFailure = { exception ->
                    _error.value = exception.message ?: "Failed to load project stats"
                }
            )
            
            _isLoading.value = false
        }
    }
    
    fun updateFilters(filters: ProjectFilters) {
        _filters.value = filters
        loadProjects()
    }
    
    fun clearError() {
        _error.value = null
    }
    
    fun clearCurrentProject() {
        _currentProject.value = null
    }
}

data class ProjectFilters(
    val search: String = "",
    val statut: String = "",
    val ordering: String = "-date_creation"
) 