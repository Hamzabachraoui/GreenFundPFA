package com.example.myapplication

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapplication.backend.database.DatabaseInitializer
import com.example.myapplication.ui.navigation.AppNavigation
import com.example.myapplication.ui.theme.CrowdfundProTheme
import com.example.myapplication.ui.viewmodel.AuthViewModel
import com.example.myapplication.ui.viewmodel.InvestmentViewModel
import com.example.myapplication.ui.viewmodel.ProjectViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialiser la base de données avec les données de test
        println("DEBUG: Début de l'initialisation de la base de données")
        val databaseInitializer = DatabaseInitializer(this)
        databaseInitializer.initializeDatabase()
        println("DEBUG: Fin de l'initialisation de la base de données")
        
        setContent {
            CrowdfundProTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    CrowdfundProApp()
                }
            }
        }
    }
}

@Composable
fun CrowdfundProApp() {
    val authViewModel: AuthViewModel = viewModel()
    val projectViewModel: ProjectViewModel = viewModel()
    val investmentViewModel: InvestmentViewModel = viewModel()
    
    AppNavigation(
        authViewModel = authViewModel,
        projectViewModel = projectViewModel,
        investmentViewModel = investmentViewModel
    )
}