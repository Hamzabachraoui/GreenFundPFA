package com.example.myapplication.backend.service

import android.content.Context
import com.example.myapplication.backend.database.DatabaseHelper
import com.example.myapplication.data.model.*
import java.text.SimpleDateFormat
import java.util.*

class InvestmentService(private val context: Context) {
    
    private val databaseHelper = DatabaseHelper(context)
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
    
    fun createInvestment(request: InvestmentCreateRequest, investisseurId: Int): Investment? {
        val investisseur = databaseHelper.getUserById(investisseurId)
        val projet = databaseHelper.getProjectById(request.projet)
        
        if (investisseur == null || projet == null) return null
        
        // Vérifier que l'investisseur n'a pas déjà investi dans ce projet
        val existingInvestments = databaseHelper.getInvestmentsByUser(investisseurId)
        if (existingInvestments.any { it.projet.id == request.projet }) {
            return null // Déjà investi
        }
        
        val investment = Investment(
            id = 0,
            projet = projet,
            investisseur = investisseur,
            montant = request.montant,
            dateInvestissement = dateFormat.format(Date()),
            statut = InvestmentStatus.EN_ATTENTE,
            statutDisplay = "En attente"
        )
        
        val investmentId = databaseHelper.createInvestment(investment)
        if (investmentId > 0) {
            // Mettre à jour le projet avec le nouvel investissement
            updateProjectAfterInvestment(projet, request.montant)
            
            return investment.copy(id = investmentId.toInt())
        }
        return null
    }
    
    fun getUserInvestments(userId: Int): List<Investment> {
        return databaseHelper.getInvestmentsByUser(userId)
    }
    
    fun getProjectInvestments(projectId: Int): List<Investment> {
        return databaseHelper.getInvestmentsByUser(0) // Tous les investissements
            .filter { it.projet.id == projectId }
    }
    
    fun updateInvestmentStatus(investmentId: Int, newStatus: InvestmentStatus): Investment? {
        // Note: Cette implémentation simplifiée ne met pas à jour la base de données
        // Dans une vraie application, vous ajouteriez une méthode updateInvestment dans DatabaseHelper
        val investments = databaseHelper.getInvestmentsByUser(0) // Tous les investissements
        return investments.find { it.id == investmentId }?.copy(
            statut = newStatus,
            statutDisplay = getInvestmentStatusDisplay(newStatus.name)
        )
    }
    
    fun getInvestmentStats(userId: Int): InvestmentStats {
        val investments = databaseHelper.getInvestmentsByUser(userId)
        
        val total = investments.size
        val montantTotal = investments.sumOf { it.montant }
        val montantMoyen = if (investments.isNotEmpty()) montantTotal / investments.size else 0.0
        
        // Calculer les statistiques par statut
        val enAttente = investments.count { it.statut == InvestmentStatus.EN_ATTENTE }
        val valide = investments.count { it.statut == InvestmentStatus.VALIDE }
        val refuse = investments.count { it.statut == InvestmentStatus.REFUSE }
        
        return InvestmentStats(
            total = total,
            enAttente = enAttente,
            valide = valide,
            refuse = refuse,
            montantTotal = montantTotal,
            montantMoyen = montantMoyen
        )
    }
    
    fun getAllInvestments(): List<Investment> {
        // Note: Cette méthode retourne tous les investissements de tous les utilisateurs
        // Dans une vraie application, vous ajouteriez une méthode getAllInvestments dans DatabaseHelper
        return databaseHelper.getInvestmentsByUser(0) // Placeholder
    }
    
    private fun updateProjectAfterInvestment(project: Project, montant: Double) {
        // Mettre à jour le montant actuel et le pourcentage de financement
        val nouveauMontantActuel = project.montantActuel + montant
        val nouveauPourcentage = (nouveauMontantActuel / project.objectif) * 100
        val nouveauNombreInvestisseurs = project.nombreInvestisseurs + 1
        
        // Note: Cette implémentation simplifiée ne met pas à jour la base de données
        // Dans une vraie application, vous ajouteriez une méthode updateProject dans DatabaseHelper
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