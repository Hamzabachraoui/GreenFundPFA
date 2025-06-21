package com.example.myapplication.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.myapplication.ui.screens.*
import com.example.myapplication.ui.viewmodel.AuthViewModel
import com.example.myapplication.ui.viewmodel.InvestmentViewModel
import com.example.myapplication.ui.viewmodel.ProjectViewModel

@Composable
fun AppNavigation(
    authViewModel: AuthViewModel,
    projectViewModel: ProjectViewModel,
    investmentViewModel: InvestmentViewModel
) {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = Screen.Home.route) {
        composable(Screen.Home.route) {
            HomeScreen(
                onNavigateToProjects = { navController.navigate(Screen.Projects.route) },
                onNavigateToProjectDetail = { projectId -> navController.navigate("${Screen.ProjectDetail.route}/$projectId") },
                onNavigateToCreateProject = { navController.navigate(Screen.CreateProject.route) },
                onNavigateToDashboard = { navController.navigate(Screen.Dashboard.route) },
                onNavigateToLogin = { navController.navigate(Screen.Login.route) },
                authViewModel = authViewModel,
                projectViewModel = projectViewModel
            )
        }
        
        composable(Screen.Login.route) {
            LoginScreen(
                onNavigateToRegister = { navController.navigate(Screen.Register.route) },
                onNavigateToHome = { navController.navigate(Screen.Home.route) },
                authViewModel = authViewModel
            )
        }
        
        composable(Screen.Register.route) {
            RegisterScreen(
                onNavigateToLogin = { navController.navigate(Screen.Login.route) },
                onNavigateToHome = { navController.navigate(Screen.Home.route) },
                authViewModel = authViewModel
            )
        }
        
        composable(Screen.Dashboard.route) {
            DashboardScreen(
                onNavigateBack = { navController.popBackStack() },
                onNavigateToProjects = { navController.navigate(Screen.Projects.route) },
                onNavigateToCreateProject = { navController.navigate(Screen.CreateProject.route) },
                onNavigateToProjectDetail = { projectId -> navController.navigate("${Screen.ProjectDetail.route}/$projectId") },
                onNavigateToInvestments = { navController.navigate(Screen.Investments.route) },
                onNavigateToProfile = { navController.navigate(Screen.Profile.route) },
                onNavigateToLogout = { navController.popBackStack() },
                authViewModel = authViewModel,
                projectViewModel = projectViewModel
            )
        }
        
        composable(Screen.Projects.route) {
            ProjectsScreen(
                onNavigateToProjectDetail = { projectId -> navController.navigate("${Screen.ProjectDetail.route}/$projectId") },
                onNavigateBack = { navController.popBackStack() },
                projectViewModel = projectViewModel
            )
        }
        
        composable(Screen.CreateProject.route) {
            CreateProjectScreen(
                onNavigateBack = { navController.popBackStack() },
                onProjectCreated = { navController.popBackStack() },
                projectViewModel = projectViewModel
            )
        }
        
        composable("${Screen.ProjectDetail.route}/{projectId}") { backStackEntry ->
            val projectId = backStackEntry.arguments?.getString("projectId")?.toIntOrNull() ?: 0
            ProjectDetailScreen(
                projectId = projectId,
                onNavigateBack = { navController.popBackStack() },
                onNavigateToInvestment = { projectId -> navController.navigate("${Screen.Investment.route}/$projectId") },
                projectViewModel = projectViewModel,
                authViewModel = authViewModel
            )
        }
        
        composable(Screen.Investments.route) {
            InvestmentsScreen(
                onNavigateBack = { navController.popBackStack() },
                onNavigateToProjectDetail = { projectId -> navController.navigate("${Screen.ProjectDetail.route}/$projectId") },
                investmentViewModel = investmentViewModel
            )
        }
        
        composable("${Screen.Investment.route}/{projectId}") { backStackEntry ->
            val projectId = backStackEntry.arguments?.getString("projectId")?.toIntOrNull() ?: 0
            InvestmentScreen(
                projectId = projectId,
                onNavigateBack = { navController.popBackStack() },
                onInvestmentSuccess = { navController.popBackStack() },
                projectViewModel = projectViewModel
            )
        }
        
        composable(Screen.Profile.route) {
            ProfileScreen(
                onNavigateBack = { navController.popBackStack() },
                onNavigateToLogout = { navController.navigate(Screen.Login.route) },
                authViewModel = authViewModel
            )
        }
    }
} 