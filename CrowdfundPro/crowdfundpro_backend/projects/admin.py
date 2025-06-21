from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    Administration pour le modèle Project
    """
    list_display = (
        'titre', 'porteur', 'objectif', 'montant_actuel', 
        'pourcentage_finance', 'statut', 'date_limite', 'date_creation', 'a_localisation'
    )
    list_filter = ('statut', 'date_creation', 'date_limite')
    search_fields = ('titre', 'description', 'porteur__email', 'adresse')
    readonly_fields = ('date_creation', 'montant_actuel', 'pourcentage_finance', 'a_localisation')
    ordering = ('-date_creation',)
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('titre', 'description', 'porteur', 'image')
        }),
        ('Localisation', {
            'fields': ('latitude', 'longitude', 'adresse', 'a_localisation'),
            'classes': ('collapse',)
        }),
        ('Documents', {
            'fields': ('business_plan', 'plan_juridique'),
            'classes': ('collapse',)
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
    
    def a_localisation(self, obj):
        return "Oui" if obj.a_localisation else "Non"
    a_localisation.short_description = "A une localisation" 