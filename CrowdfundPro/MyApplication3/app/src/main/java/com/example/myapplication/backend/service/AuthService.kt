package com.example.myapplication.backend.service

import android.content.Context
import com.example.myapplication.backend.database.DatabaseHelper
import com.example.myapplication.data.model.*
import java.security.MessageDigest
import java.text.SimpleDateFormat
import java.util.*

class AuthService(private val context: Context) {
    
    private val databaseHelper = DatabaseHelper(context)
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
    
    fun login(email: String, password: String): AuthResponse? {
        println("DEBUG: ===== DÉBUT TENTATIVE DE CONNEXION =====")
        println("DEBUG: Email fourni: '$email'")
        println("DEBUG: Mot de passe fourni: '$password'")
        
        val user = databaseHelper.getUserByEmail(email)
        println("DEBUG: Utilisateur trouvé dans la base de données: ${user != null}")
        
        if (user == null) {
            println("DEBUG: ===== ÉCHEC: Utilisateur non trouvé =====")
            return null
        }
        
        println("DEBUG: Détails de l'utilisateur trouvé:")
        println("DEBUG: - ID: ${user.id}")
        println("DEBUG: - Email: ${user.email}")
        println("DEBUG: - Nom: ${user.nom}")
        println("DEBUG: - Rôle: ${user.role}")
        
        println("DEBUG: Vérification du mot de passe...")
        val passwordValid = verifyPassword(password, user)
        println("DEBUG: Mot de passe valide: $passwordValid")
        
        if (passwordValid) {
            println("DEBUG: Génération des tokens...")
            val tokens = generateTokens(user)
            databaseHelper.saveToken(user.id, tokens.first, tokens.second)
            println("DEBUG: Tokens générés et sauvegardés")
            
            val response = AuthResponse(
                user = user,
                tokens = Tokens(
                    access = tokens.first,
                    refresh = tokens.second
                )
            )
            println("DEBUG: ===== CONNEXION RÉUSSIE =====")
            return response
        } else {
            println("DEBUG: ===== ÉCHEC: Mot de passe invalide =====")
        }
        return null
    }
    
    fun register(
        email: String,
        username: String,
        nom: String,
        password: String,
        role: UserRole
    ): AuthResponse? {
        // Vérifier si l'utilisateur existe déjà
        if (databaseHelper.getUserByEmail(email) != null) {
            println("DEBUG: ===== ÉCHEC: Email déjà utilisé =====")
            return null
        }
        
        // Créer le nouvel utilisateur
        val hashedPassword = hashPassword(password)
        val user = User(
            id = 0, // Sera généré par la base de données
            email = email,
            username = username,
            nom = nom,
            role = role,
            dateInscription = dateFormat.format(Date()),
            isActive = true
        )
        
        val userId = databaseHelper.createUser(user, hashedPassword)
        if (userId > 0) {
            val createdUser = user.copy(id = userId.toInt())
            val tokens = generateTokens(createdUser)
            databaseHelper.saveToken(createdUser.id, tokens.first, tokens.second)
            
            println("DEBUG: ===== INSCRIPTION RÉUSSIE =====")
            return AuthResponse(
                user = createdUser,
                tokens = Tokens(
                    access = tokens.first,
                    refresh = tokens.second
                )
            )
        }
        println("DEBUG: ===== ÉCHEC: Erreur lors de la création de l'utilisateur =====")
        return null
    }
    
    fun refreshToken(refreshToken: String): Tokens? {
        // Dans une vraie application, vous vérifieriez le refresh token
        // Pour simplifier, on génère de nouveaux tokens
        val userId = extractUserIdFromToken(refreshToken)
        if (userId != null) {
            val user = databaseHelper.getUserById(userId)
            if (user != null) {
                val tokens = generateTokens(user)
                databaseHelper.saveToken(user.id, tokens.first, tokens.second)
                return Tokens(access = tokens.first, refresh = tokens.second)
            }
        }
        return null
    }
    
    fun getUserById(userId: Int): User? {
        return databaseHelper.getUserById(userId)
    }
    
    fun getUserByToken(token: String): User? {
        val userId = extractUserIdFromToken(token)
        return userId?.let { databaseHelper.getUserById(it) }
    }
    
    private fun verifyPassword(password: String, user: User): Boolean {
        val hashedPassword = hashPassword(password)
        val isValid = databaseHelper.verifyPassword(user.email, hashedPassword)
        println("DEBUG: Vérification du mot de passe pour l'utilisateur: ${user.email}")
        println("DEBUG: Mot de passe fourni: $password")
        println("DEBUG: Hash du mot de passe: $hashedPassword")
        println("DEBUG: Mot de passe valide: $isValid")
        return isValid
    }
    
    private fun hashPassword(password: String): String {
        val bytes = MessageDigest.getInstance("SHA-256").digest(password.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }
    
    private fun generateTokens(user: User): Pair<String, String> {
        val accessToken = generateJWT(user, 60 * 60 * 1000) // 1 heure
        val refreshToken = generateJWT(user, 24 * 60 * 60 * 1000) // 1 jour
        return Pair(accessToken, refreshToken)
    }
    
    private fun generateJWT(user: User, expirationTime: Long): String {
        val header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}"
        val payload = """
            {
                "user_id": ${user.id},
                "email": "${user.email}",
                "role": "${user.role}",
                "exp": ${System.currentTimeMillis() + expirationTime}
            }
        """.trimIndent()
        
        val encodedHeader = android.util.Base64.encodeToString(header.toByteArray(), android.util.Base64.URL_SAFE)
        val encodedPayload = android.util.Base64.encodeToString(payload.toByteArray(), android.util.Base64.URL_SAFE)
        
        // Signature simplifiée (dans une vraie app, utilisez une clé secrète)
        val signature = hashPassword("$encodedHeader.$encodedPayload")
        val encodedSignature = android.util.Base64.encodeToString(signature.toByteArray(), android.util.Base64.URL_SAFE)
        
        return "$encodedHeader.$encodedPayload.$encodedSignature"
    }
    
    private fun extractUserIdFromToken(token: String): Int? {
        try {
            val parts = token.split(".")
            if (parts.size == 3) {
                val payload = String(android.util.Base64.decode(parts[1], android.util.Base64.URL_SAFE))
                // Parse simple du JSON pour extraire user_id
                val userIdMatch = Regex("\"user_id\":\\s*(\\d+)").find(payload)
                return userIdMatch?.groupValues?.get(1)?.toInt()
            }
        } catch (e: Exception) {
            // Token invalide
        }
        return null
    }
} 