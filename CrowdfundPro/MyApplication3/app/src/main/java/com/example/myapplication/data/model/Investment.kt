package com.example.myapplication.data.model

import com.google.gson.annotations.SerializedName

data class Investment(
    val id: Int,
    val projet: Project,
    val investisseur: User,
    val montant: Double,
    @SerializedName("date_investissement")
    val dateInvestissement: String,
    val statut: InvestmentStatus,
    @SerializedName("statut_display")
    val statutDisplay: String
)

enum class InvestmentStatus {
    @SerializedName("EN_ATTENTE")
    EN_ATTENTE,
    @SerializedName("VALIDE")
    VALIDE,
    @SerializedName("REFUSE")
    REFUSE
}

data class InvestmentCreateRequest(
    val projet: Int,
    val montant: Double
)

data class InvestmentStats(
    val total: Int,
    @SerializedName("en_attente")
    val enAttente: Int,
    val valide: Int,
    val refuse: Int,
    @SerializedName("montant_total")
    val montantTotal: Double,
    @SerializedName("montant_moyen")
    val montantMoyen: Double
)

data class InvestmentDashboard(
    val stats: InvestmentStats,
    @SerializedName("recent_investments")
    val recentInvestments: List<Investment>
)

data class PaymentIntentRequest(
    @SerializedName("investment_id")
    val investmentId: Int
)

data class PaymentIntentResponse(
    @SerializedName("client_secret")
    val clientSecret: String,
    @SerializedName("payment_intent_id")
    val paymentIntentId: String
)

data class PaymentConfirmationRequest(
    @SerializedName("payment_intent_id")
    val paymentIntentId: String,
    @SerializedName("investment_id")
    val investmentId: Int
) 