package com.example.myapplication.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapplication.data.model.InvestmentCreateRequest
import com.example.myapplication.data.model.Project
import com.example.myapplication.data.model.ProjectStatus
import com.example.myapplication.ui.viewmodel.ProjectViewModel
import java.text.NumberFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InvestmentScreen(
    projectId: Int,
    onNavigateBack: () -> Unit,
    onInvestmentSuccess: () -> Unit,
    projectViewModel: ProjectViewModel = viewModel()
) {
    val currentProject by projectViewModel.currentProject.collectAsState()
    val isLoading by projectViewModel.isLoading.collectAsState()
    val error by projectViewModel.error.collectAsState()
    
    var investmentAmount by remember { mutableStateOf("") }
    var showConfirmation by remember { mutableStateOf(false) }
    
    // Charger le projet au démarrage
    LaunchedEffect(projectId) {
        projectViewModel.loadProject(projectId)
    }
    
    // Validation du montant
    val amount = investmentAmount.toDoubleOrNull() ?: 0.0
    val isValidAmount = amount > 0 && currentProject?.let { project ->
        amount <= project.objectif - project.montantActuel
    } ?: false
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Investir",
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Retour"
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { paddingValues ->
        if (isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            currentProject?.let { project ->
                if (project.statut != ProjectStatus.EN_COURS) {
                    // Projet non disponible pour investissement
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(paddingValues),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                imageVector = Icons.Default.Block,
                                contentDescription = null,
                                modifier = Modifier.size(64.dp),
                                tint = MaterialTheme.colorScheme.error
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = "Investissement non disponible",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = "Ce projet n'accepte plus d'investissements",
                                fontSize = 14.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                } else {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(paddingValues)
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // Informations du projet
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.surface
                            )
                        ) {
                            Column(
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Text(
                                    text = project.titre,
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                
                                Spacer(modifier = Modifier.height(8.dp))
                                
                                Text(
                                    text = project.description,
                                    fontSize = 14.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    maxLines = 3
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
                            }
                        }
                        
                        // Formulaire d'investissement
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.surface
                            )
                        ) {
                            Column(
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Text(
                                    text = "Montant de l'investissement",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                
                                Spacer(modifier = Modifier.height(16.dp))
                                
                                // Champ de saisie du montant
                                OutlinedTextField(
                                    value = investmentAmount,
                                    onValueChange = { 
                                        // Filtrer pour n'accepter que les nombres
                                        if (it.isEmpty() || it.matches(Regex("^\\d*\\.?\\d*$"))) {
                                            investmentAmount = it
                                        }
                                    },
                                    label = { Text("Montant en euros") },
                                    leadingIcon = {
                                        Icon(
                                            imageVector = Icons.Default.Euro,
                                            contentDescription = "Montant"
                                        )
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    keyboardOptions = KeyboardOptions(
                                        keyboardType = KeyboardType.Decimal
                                    ),
                                    singleLine = true,
                                    isError = investmentAmount.isNotBlank() && !isValidAmount
                                )
                                
                                // Messages d'aide
                                if (investmentAmount.isNotBlank()) {
                                    Spacer(modifier = Modifier.height(8.dp))
                                    if (!isValidAmount) {
                                        Text(
                                            text = "Le montant doit être supérieur à 0 et ne pas dépasser le montant restant à collecter",
                                            fontSize = 12.sp,
                                            color = MaterialTheme.colorScheme.error
                                        )
                                    } else {
                                        val remainingAmount = project.objectif - project.montantActuel
                                        Text(
                                            text = "Montant restant à collecter : ${NumberFormat.getCurrencyInstance(Locale.FRANCE).format(remainingAmount)}",
                                            fontSize = 12.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                                
                                Spacer(modifier = Modifier.height(16.dp))
                                
                                // Bouton d'investissement
                                Button(
                                    onClick = { showConfirmation = true },
                                    modifier = Modifier.fillMaxWidth(),
                                    enabled = isValidAmount,
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = MaterialTheme.colorScheme.primary
                                    )
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Check,
                                        contentDescription = null
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Confirmer l'investissement")
                                }
                            }
                        }
                        
                        // Informations importantes
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.secondaryContainer
                            )
                        ) {
                            Column(
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Info,
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.onSecondaryContainer
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "Informations importantes",
                                        fontSize = 16.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSecondaryContainer
                                    )
                                }
                                
                                Spacer(modifier = Modifier.height(8.dp))
                                
                                Text(
                                    text = "• Votre investissement sera validé par l'équipe CrowdfundPro\n" +
                                            "• Vous recevrez une confirmation par email\n" +
                                            "• Le paiement sera sécurisé via notre partenaire de paiement\n" +
                                            "• Vous pourrez suivre votre investissement dans votre tableau de bord",
                                    fontSize = 14.sp,
                                    color = MaterialTheme.colorScheme.onSecondaryContainer,
                                    lineHeight = 20.sp
                                )
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Dialog de confirmation
    if (showConfirmation) {
        AlertDialog(
            onDismissRequest = { showConfirmation = false },
            title = {
                Text(
                    text = "Confirmer l'investissement",
                    fontWeight = FontWeight.Bold
                )
            },
            text = {
                currentProject?.let { project ->
                    Column {
                        Text(
                            text = "Vous êtes sur le point d'investir ${NumberFormat.getCurrencyInstance(Locale.FRANCE).format(amount)} dans le projet :",
                            fontSize = 16.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = project.titre,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Êtes-vous sûr de vouloir continuer ?",
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showConfirmation = false
                        // Ici, vous pouvez ajouter la logique pour créer l'investissement
                        onInvestmentSuccess()
                    }
                ) {
                    Text("Confirmer")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = { showConfirmation = false }
                ) {
                    Text("Annuler")
                }
            }
        )
    }
} 