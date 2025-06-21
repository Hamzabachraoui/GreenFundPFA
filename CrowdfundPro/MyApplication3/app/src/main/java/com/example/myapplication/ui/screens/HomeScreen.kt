package com.example.myapplication.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.example.myapplication.data.model.Project
import com.example.myapplication.data.model.UserRole
import com.example.myapplication.ui.viewmodel.AuthViewModel
import com.example.myapplication.ui.viewmodel.ProjectViewModel
import java.text.NumberFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToProjects: () -> Unit,
    onNavigateToProjectDetail: (Int) -> Unit,
    onNavigateToCreateProject: () -> Unit,
    onNavigateToDashboard: () -> Unit,
    onNavigateToLogin: () -> Unit,
    authViewModel: AuthViewModel = viewModel(),
    projectViewModel: ProjectViewModel = viewModel()
) {
    val authState by authViewModel.authState.collectAsState()
    val projects by projectViewModel.projects.collectAsState()
    val isLoading by projectViewModel.isLoading.collectAsState()
    
    // Charger les projets au démarrage
    LaunchedEffect(Unit) {
        projectViewModel.loadProjects()
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Rocket,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "CrowdfundPro",
                            fontWeight = FontWeight.Bold
                        )
                    }
                },
                actions = {
                    when (authState) {
                        is com.example.myapplication.data.repository.AuthState.Authenticated -> {
                            IconButton(onClick = onNavigateToDashboard) {
                                Icon(
                                    imageVector = Icons.Default.Dashboard,
                                    contentDescription = "Tableau de bord"
                                )
                            }
                        }
                        else -> {
                            IconButton(onClick = onNavigateToLogin) {
                                Icon(
                                    imageVector = Icons.Default.Login,
                                    contentDescription = "Se connecter"
                                )
                            }
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Hero Section
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(
                                        MaterialTheme.colorScheme.primary,
                                        MaterialTheme.colorScheme.secondary
                                    )
                                )
                            )
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(24.dp),
                            verticalArrangement = Arrangement.Center,
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "🚀",
                                fontSize = 48.sp
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Financez vos projets innovants",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimary,
                                textAlign = TextAlign.Center
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Découvrez et soutenez les projets qui façonnent l'avenir",
                                fontSize = 16.sp,
                                color = MaterialTheme.colorScheme.onPrimary.copy(alpha = 0.8f),
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            }
            
            // Stats Section
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        StatItem(
                            icon = Icons.Default.TrendingUp,
                            value = "100+",
                            label = "Projets financés"
                        )
                        StatItem(
                            icon = Icons.Default.Euro,
                            value = "500K€",
                            label = "Montant collecté"
                        )
                        StatItem(
                            icon = Icons.Default.People,
                            value = "1000+",
                            label = "Investisseurs"
                        )
                    }
                }
            }
            
            // Projets à la une (si connecté)
            if (authState is com.example.myapplication.data.repository.AuthState.Authenticated) {
                item {
                    Text(
                        text = "Projets à la Une",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
                
                if (isLoading) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(200.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            CircularProgressIndicator()
                        }
                    }
                } else {
                    items(projects.take(3)) { project ->
                        ProjectCard(
                            project = project,
                            onClick = { onNavigateToProjectDetail(project.id) }
                        )
                    }
                    
                    if (projects.isNotEmpty()) {
                        item {
                            Button(
                                onClick = onNavigateToProjects,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Voir tous les projets")
                            }
                        }
                    }
                }
            }
            
            // CTA Section
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.secondary
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Prêt à commencer ?",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSecondary,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Rejoignez notre communauté et donnez vie à vos projets",
                            fontSize = 16.sp,
                            color = MaterialTheme.colorScheme.onSecondary.copy(alpha = 0.8f),
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        when (authState) {
                            is com.example.myapplication.data.repository.AuthState.Authenticated -> {
                                val user = (authState as com.example.myapplication.data.repository.AuthState.Authenticated).user
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    if (user.role == UserRole.PORTEUR) {
                                        Button(
                                            onClick = onNavigateToCreateProject,
                                            modifier = Modifier.weight(1f)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Add,
                                                contentDescription = null
                                            )
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text("Créer un projet")
                                        }
                                    } else {
                                        Button(
                                            onClick = onNavigateToProjects,
                                            modifier = Modifier.weight(1f)
                                        ) {
                                            Text("Découvrir les projets")
                                        }
                                    }
                                    
                                    OutlinedButton(
                                        onClick = onNavigateToDashboard,
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("Mon tableau de bord")
                                    }
                                }
                            }
                            else -> {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Button(
                                        onClick = onNavigateToLogin,
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("S'inscrire")
                                    }
                                    OutlinedButton(
                                        onClick = onNavigateToLogin,
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text("Se connecter")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun StatItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    value: String,
    label: String
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(32.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = value,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = label,
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ProjectCard(
    project: Project,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column {
            // Image du projet
            project.image?.let { imageUrl ->
                AsyncImage(
                    model = imageUrl,
                    contentDescription = project.titre,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(160.dp)
                        .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp)),
                    contentScale = ContentScale.Crop
                )
            }
            
            // Contenu du projet
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = project.titre,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Text(
                    text = project.description,
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // Progression du financement
                LinearProgressIndicator(
                    progress = (project.pourcentageFinance.toFloat() / 100f).coerceIn(0f, 1f),
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.primary
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "${project.pourcentageFinance.toInt()}% financé",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = "${NumberFormat.getCurrencyInstance(Locale.FRANCE).format(project.montantActuel)} / ${NumberFormat.getCurrencyInstance(Locale.FRANCE).format(project.objectif)}",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Statut du projet
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = when (project.statut) {
                            com.example.myapplication.data.model.ProjectStatus.EN_COURS -> Color(0xFFE3F2FD)
                            com.example.myapplication.data.model.ProjectStatus.FINANCE -> Color(0xFFE8F5E8)
                            com.example.myapplication.data.model.ProjectStatus.ECHOUE -> Color(0xFFFFEBEE)
                            else -> Color(0xFFFFF3E0)
                        }
                    )
                ) {
                    Text(
                        text = project.statutDisplay,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        fontSize = 12.sp,
                        color = when (project.statut) {
                            com.example.myapplication.data.model.ProjectStatus.EN_COURS -> Color(0xFF1976D2)
                            com.example.myapplication.data.model.ProjectStatus.FINANCE -> Color(0xFF388E3C)
                            com.example.myapplication.data.model.ProjectStatus.ECHOUE -> Color(0xFFD32F2F)
                            else -> Color(0xFFF57C00)
                        }
                    )
                }
            }
        }
    }
} 