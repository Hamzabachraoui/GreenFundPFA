from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    Administration pour le modèle Project
    """
    list_display = (
        'titre', 'porteur', 'objectif', 'montant_actuel', 
        'pourcentage_finance', 'statut', 'date_limite', 'date_creation'
    )
    list_filter = ('statut', 'date_creation', 'date_limite')
    search_fields = ('titre', 'description', 'porteur__email')
    readonly_fields = ('date_creation', 'montant_actuel', 'pourcentage_finance')
    ordering = ('-date_creation',)
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('titre', 'description', 'porteur', 'image')
        }),
        ('Financement', {
            'fields': ('objectif', 'montant_actuel', 'statut')
        }),
        ('Dates', {
            'fields': ('date_limite', 'date_creation')
        }),
    )
    
    def pourcentage_finance(self, obj):
        return f"{obj.pourcentage_finance:.1f}%"
    pourcentage_finance.short_description = "Pourcentage financé" 