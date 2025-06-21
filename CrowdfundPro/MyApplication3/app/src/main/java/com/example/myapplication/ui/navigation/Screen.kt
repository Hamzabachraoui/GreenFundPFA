package com.example.myapplication.ui.navigation

import androidx.navigation.NavType
import androidx.navigation.navArgument

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Login : Screen("login")
    object Register : Screen("register")
    object Dashboard : Screen("dashboard")
    object Projects : Screen("projects")
    object CreateProject : Screen("create_project")
    object ProjectDetail : Screen("project_detail")
    object Investments : Screen("investments")
    object Investment : Screen("investment")
    object Profile : Screen("profile")
} 