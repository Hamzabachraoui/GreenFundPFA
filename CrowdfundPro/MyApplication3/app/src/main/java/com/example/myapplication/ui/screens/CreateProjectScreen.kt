package com.example.myapplication.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapplication.data.model.ProjectCreateRequest
import com.example.myapplication.ui.viewmodel.ProjectViewModel
import com.example.myapplication.ui.viewmodel.AuthViewModel
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateProjectScreen(
    onNavigateBack: () -> Unit,
    onProjectCreated: () -> Unit,
    projectViewModel: ProjectViewModel = viewModel(),
    authViewModel: AuthViewModel = viewModel()
) {
    var titre by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var objectif by remember { mutableStateOf("") }
    var dateLimite by remember { mutableStateOf("") }
    var adresse by remember { mutableStateOf("") }
    
    val isLoading by projectViewModel.isLoading.collectAsState()
    val error by projectViewModel.error.collectAsState()
    val authState by authViewModel.authState.collectAsState()
    
    // Obtenir l'utilisateur connecté
    val currentUser = when (authState) {
        is com.example.myapplication.data.repository.AuthState.Authenticated -> (authState as com.example.myapplication.data.repository.AuthState.Authenticated).user
        else -> null
    }
    
    // Validation du formulaire
    val isValidForm = titre.isNotBlank() && 
                     description.isNotBlank() && 
                     objectif.toDoubleOrNull() != null && 
                     objectif.toDoubleOrNull()!! > 0 &&
                     dateLimite.isNotBlank()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Créer un projet",
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
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Message d'erreur
            error?.let { errorMessage ->
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.errorContainer
                    )
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Error,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = errorMessage,
                            color = MaterialTheme.colorScheme.onErrorContainer
                        )
                    }
                }
            }
            
            // Titre du projet
            OutlinedTextField(
                value = titre,
                onValueChange = { titre = it },
                label = { Text("Titre du projet") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Title,
                        contentDescription = "Titre"
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            
            // Description du projet
            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Description du projet") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Description,
                        contentDescription = "Description"
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                minLines = 4,
                maxLines = 8
            )
            
            // Objectif de financement
            OutlinedTextField(
                value = objectif,
                onValueChange = { 
                    // Filtrer pour n'accepter que les nombres
                    if (it.isEmpty() || it.matches(Regex("^\\d*\\.?\\d*$"))) {
                        objectif = it
                    }
                },
                label = { Text("Objectif de financement (€)") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Euro,
                        contentDescription = "Objectif"
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Decimal
                ),
                singleLine = true
            )
            
            // Date limite
            OutlinedTextField(
                value = dateLimite,
                onValueChange = { dateLimite = it },
                label = { Text("Date limite (YYYY-MM-DD)") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.DateRange,
                        contentDescription = "Date limite"
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                placeholder = {
                    Text("Ex: 2024-12-31")
                }
            )
            
            // Adresse (optionnelle)
            OutlinedTextField(
                value = adresse,
                onValueChange = { adresse = it },
                label = { Text("Adresse (optionnelle)") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = "Adresse"
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            
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
                        text = "• Votre projet sera soumis à validation par l'équipe CrowdfundPro\n" +
                                "• Assurez-vous que toutes les informations sont exactes\n" +
                                "• Vous pourrez modifier votre projet après validation\n" +
                                "• La date limite doit être dans le futur",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSecondaryContainer,
                        lineHeight = 20.sp
                    )
                }
            }
            
            // Bouton de création
            Button(
                onClick = {
                    val objectifValue = objectif.toDoubleOrNull() ?: 0.0
                    val request = ProjectCreateRequest(
                        titre = titre,
                        description = description,
                        objectif = objectifValue,
                        dateLimite = dateLimite,
                        adresse = adresse.takeIf { it.isNotBlank() }
                    )
                    currentUser?.let { user ->
                        projectViewModel.createProject(request, user.id)
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = isValidForm && !isLoading && currentUser != null,
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.primary
                )
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                        strokeWidth = 2.dp
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Création en cours...")
                } else {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = null
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Créer le projet")
                }
            }
        }
    }
    
    // Observer le succès de création
    LaunchedEffect(Unit) {
        // Ici vous pourriez observer un état de succès du ViewModel
        // et appeler onProjectCreated() quand le projet est créé avec succès
    }
} 