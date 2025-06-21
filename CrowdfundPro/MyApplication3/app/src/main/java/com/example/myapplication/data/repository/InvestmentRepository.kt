package com.example.myapplication.data.repository

import android.content.Context
import com.example.myapplication.backend.service.InvestmentService
import com.example.myapplication.data.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class InvestmentRepository(private val context: Context) {
    
    private val investmentService = InvestmentService(context)
    
    suspend fun createInvestment(request: InvestmentCreateRequest, investisseurId: Int): Result<Investment> = withContext(Dispatchers.IO) {
        try {
            val investment = investmentService.createInvestment(request, investisseurId)
            if (investment != null) {
                Result.success(investment)
            } else {
                Result.failure(Exception("Erreur lors de la création de l'investissement"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUserInvestments(userId: Int): Result<List<Investment>> = withContext(Dispatchers.IO) {
        try {
            val investments = investmentService.getUserInvestments(userId)
            Result.success(investments)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getProjectInvestments(projectId: Int): Result<List<Investment>> = withContext(Dispatchers.IO) {
        try {
            val investments = investmentService.getProjectInvestments(projectId)
            Result.success(investments)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun updateInvestmentStatus(investmentId: Int, newStatus: InvestmentStatus): Result<Investment> = withContext(Dispatchers.IO) {
        try {
            val investment = investmentService.updateInvestmentStatus(investmentId, newStatus)
            if (investment != null) {
                Result.success(investment)
            } else {
                Result.failure(Exception("Erreur lors de la mise à jour du statut"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getInvestmentStats(userId: Int): Result<InvestmentStats> = withContext(Dispatchers.IO) {
        try {
            val stats = investmentService.getInvestmentStats(userId)
            Result.success(stats)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getAllInvestments(): Result<List<Investment>> = withContext(Dispatchers.IO) {
        try {
            val investments = investmentService.getAllInvestments()
            Result.success(investments)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
} 