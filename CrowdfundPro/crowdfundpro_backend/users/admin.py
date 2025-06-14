from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Administration personnalisée pour le modèle User
    """
    list_display = ('email', 'username', 'nom', 'role', 'is_active', 'date_inscription')
    list_filter = ('role', 'is_active', 'date_inscription')
    search_fields = ('email', 'username', 'nom')
    ordering = ('-date_inscription',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('role', 'nom', 'date_inscription')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('email', 'role', 'nom')
        }),
    ) 