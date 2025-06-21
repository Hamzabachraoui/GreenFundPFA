package com.example.myapplication.data.model

import com.google.gson.annotations.SerializedName

data class User(
    val id: Int,
    val email: String,
    val username: String,
    val nom: String,
    val role: UserRole,
    @SerializedName("date_inscription")
    val dateInscription: String,
    val telephone: String? = null,
    val adresse: String? = null,
    val token: String? = null,
    @SerializedName("is_active")
    val isActive: Boolean = true
)

enum class UserRole {
    @SerializedName("ADMIN")
    ADMIN,
    @SerializedName("PORTEUR")
    PORTEUR,
    @SerializedName("INVESTISSEUR")
    INVESTISSEUR
}

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val username: String,
    val nom: String,
    val password: String,
    val password2: String,
    val role: UserRole
)

data class AuthResponse(
    val user: User,
    val tokens: Tokens
)

data class Tokens(
    val access: String,
    val refresh: String
) 