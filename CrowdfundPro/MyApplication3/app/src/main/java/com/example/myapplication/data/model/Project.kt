package com.example.myapplication.data.model

import com.google.gson.annotations.SerializedName

data class Project(
    val id: Int,
    val titre: String,
    val description: String,
    val objectif: Double,
    @SerializedName("montant_actuel")
    val montantActuel: Double,
    @SerializedName("date_creation")
    val dateCreation: String,
    @SerializedName("date_limite")
    val dateLimite: String,
    val statut: ProjectStatus,
    @SerializedName("statut_display")
    val statutDisplay: String,
    val image: String? = null,
    val porteur: User,
    @SerializedName("nombre_investisseurs")
    val nombreInvestisseurs: Int = 0,
    @SerializedName("pourcentage_finance")
    val pourcentageFinance: Double = 0.0,
    @SerializedName("montant_cible")
    val montantCible: Double = 0.0,
    @SerializedName("date_debut")
    val dateDebut: String? = null,
    @SerializedName("date_fin")
    val dateFin: String? = null,
    val investissements: List<Investment>? = null,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val adresse: String? = null,
    @SerializedName("a_localisation")
    val aLocalisation: Boolean = false,
    @SerializedName("business_plan")
    val businessPlan: String? = null,
    @SerializedName("plan_juridique")
    val planJuridique: String? = null
)

enum class ProjectStatus {
    @SerializedName("EN_ATTENTE_VALIDATION")
    EN_ATTENTE_VALIDATION,
    @SerializedName("EN_COURS")
    EN_COURS,
    @SerializedName("FINANCE")
    FINANCE,
    @SerializedName("ECHOUE")
    ECHOUE
}

data class ProjectCreateRequest(
    val titre: String,
    val description: String,
    val objectif: Double,
    @SerializedName("date_limite")
    val dateLimite: String,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val adresse: String? = null
)

data class ProjectStats(
    val total: Int,
    @SerializedName("en_cours")
    val enCours: Int,
    val finance: Int,
    val echoue: Int,
    @SerializedName("montant_total")
    val montantTotal: Double,
    @SerializedName("montant_moyen")
    val montantMoyen: Double
)

data class PaginatedResponse<T>(
    val count: Int,
    val next: String?,
    val previous: String?,
    val results: List<T>
) 