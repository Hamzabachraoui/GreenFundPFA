from django.contrib import admin
from .models import Investment


@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    """
    Administration pour le modèle Investment
    """
    list_display = (
        'investisseur', 'projet', 'montant', 'statut_paiement',
        'methode_paiement', 'date_investissement'
    )
    list_filter = ('statut_paiement', 'methode_paiement', 'date_investissement')
    search_fields = (
        'investisseur__email', 'projet__titre', 
        'stripe_payment_intent_id'
    )
    readonly_fields = ('date_investissement', 'stripe_payment_intent_id', 'stripe_client_secret')
    ordering = ('-date_investissement',)
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('investisseur', 'projet', 'montant', 'date_investissement')
        }),
        ('Paiement', {
            'fields': ('methode_paiement', 'statut_paiement')
        }),
        ('Stripe', {
            'fields': ('stripe_payment_intent_id', 'stripe_client_secret'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('investisseur', 'projet') 