package com.example.myapplication.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.model.AuthResponse
import com.example.myapplication.data.model.UserRole
import com.example.myapplication.data.repository.AuthRepository
import com.example.myapplication.data.repository.AuthState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AuthViewModel(application: Application) : AndroidViewModel(application) {
    
    private val authRepository = AuthRepository(application)
    
    private val _authState = MutableStateFlow<AuthState>(AuthState.Unauthenticated)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    init {
        // Initialiser l'état avec l'utilisateur actuel s'il existe
        val currentUser = authRepository.getCurrentUser()
        _authState.value = currentUser?.let { AuthState.Authenticated(it) } ?: AuthState.Unauthenticated
    }
    
    fun login(email: String, password: String) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            try {
                val result = authRepository.login(email, password)
                result.fold(
                    onSuccess = { response ->
                        _authState.value = AuthState.Authenticated(response.user)
                    },
                    onFailure = { exception ->
                        _error.value = exception.message ?: "Erreur de connexion"
                        _authState.value = AuthState.Unauthenticated
                    }
                )
            } catch (e: Exception) {
                _error.value = e.message ?: "Erreur inattendue"
                _authState.value = AuthState.Unauthenticated
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun register(
        email: String,
        username: String,
        nom: String,
        password: String,
        role: UserRole
    ) {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            try {
                val result = authRepository.register(email, username, nom, password, role)
                result.fold(
                    onSuccess = { response ->
                        _authState.value = AuthState.Authenticated(response.user)
                    },
                    onFailure = { exception ->
                        _error.value = exception.message ?: "Erreur d'inscription"
                        _authState.value = AuthState.Unauthenticated
                    }
                )
            } catch (e: Exception) {
                _error.value = e.message ?: "Erreur inattendue"
                _authState.value = AuthState.Unauthenticated
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun logout() {
        viewModelScope.launch {
            _isLoading.value = true
            
            authRepository.logout()
            _authState.value = AuthState.Unauthenticated
            
            _isLoading.value = false
        }
    }
    
    fun clearError() {
        _error.value = null
    }
    
    fun setError(message: String) {
        _error.value = message
    }
    
    fun isLoggedIn(): Boolean {
        return authRepository.getCurrentUser() != null
    }
    
    fun getCurrentUser() = authRepository.getCurrentUser()
} 