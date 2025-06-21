package com.example.myapplication.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.myapplication.data.model.Investment
import com.example.myapplication.data.repository.InvestmentRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class InvestmentViewModel(application: Application) : AndroidViewModel(application) {
    
    private val investmentRepository = InvestmentRepository(application)
    
    private val _investments = MutableStateFlow<List<Investment>>(emptyList())
    val investments: StateFlow<List<Investment>> = _investments.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    fun loadInvestments() {
        viewModelScope.launch {
            _isLoading.value = true
            _error.value = null
            
            val result = investmentRepository.getAllInvestments()
            
            result.fold(
                onSuccess = { investments ->
                    _investments.value = investments
                },
                onFailure = { exception ->
                    _error.value = exception.message ?: "Failed to load investments"
                }
            )
            
            _isLoading.value = false
        }
    }
    
    fun clearError() {
        _error.value = null
    }
} 