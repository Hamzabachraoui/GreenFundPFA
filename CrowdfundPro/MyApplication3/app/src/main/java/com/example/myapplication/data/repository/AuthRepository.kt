package com.example.myapplication.data.repository

import android.content.Context
import com.example.myapplication.backend.service.AuthService
import com.example.myapplication.data.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

sealed class AuthState {
    object Unauthenticated : AuthState()
    data class Authenticated(val user: User) : AuthState()
    object Loading : AuthState()
}

class AuthRepository(private val context: Context) {
    
    private val authService = AuthService(context)
    
    // État d'authentification actuel
    private var currentUser: User? = null
    
    // Propriété pour accéder à l'état d'authentification
    val authState: AuthState
        get() = currentUser?.let { AuthState.Authenticated(it) } ?: AuthState.Unauthenticated
    
    suspend fun login(email: String, password: String): Result<AuthResponse> = withContext(Dispatchers.IO) {
        try {
            val response = authService.login(email, password)
            if (response != null) {
                currentUser = response.user
                Result.success(response)
            } else {
                Result.failure(Exception("Email ou mot de passe incorrect"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun register(
        email: String,
        username: String,
        nom: String,
        password: String,
        role: UserRole
    ): Result<AuthResponse> = withContext(Dispatchers.IO) {
        try {
            val response = authService.register(email, username, nom, password, role)
            if (response != null) {
                currentUser = response.user
                Result.success(response)
            } else {
                Result.failure(Exception("Erreur lors de l'inscription"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun refreshToken(refreshToken: String): Result<Tokens> = withContext(Dispatchers.IO) {
        try {
            val tokens = authService.refreshToken(refreshToken)
            if (tokens != null) {
                Result.success(tokens)
            } else {
                Result.failure(Exception("Token de rafraîchissement invalide"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUserById(userId: Int): Result<User> = withContext(Dispatchers.IO) {
        try {
            val user = authService.getUserById(userId)
            if (user != null) {
                Result.success(user)
            } else {
                Result.failure(Exception("Utilisateur non trouvé"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUserByToken(token: String): Result<User> = withContext(Dispatchers.IO) {
        try {
            val user = authService.getUserByToken(token)
            if (user != null) {
                Result.success(user)
            } else {
                Result.failure(Exception("Token invalide"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    // Méthode pour se déconnecter
    fun logout() {
        currentUser = null
    }
    
    // Méthode pour obtenir l'utilisateur actuel
    fun getCurrentUser(): User? = currentUser
} 