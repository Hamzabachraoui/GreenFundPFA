from rest_framework import serializers
from django.utils import timezone
from .models import Project
from users.serializers import UserProfileSerializer


class ProjectCreateSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour la création de projets
    """
    class Meta:
        model = Project
        fields = ('titre', 'description', 'objectif', 'date_limite', 'image')
    
    def validate_date_limite(self, value):
        """Valide la date limite"""
        if value <= timezone.now():
            raise serializers.ValidationError("La date limite doit être dans le futur.")
        return value
    
    def validate_objectif(self, value):
        """Valide l'objectif de financement"""
        if value <= 0:
            raise serializers.ValidationError("L'objectif doit être supérieur à 0.")
        return value
    
    def validate_titre(self, value):
        """Valide le titre"""
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Le titre doit contenir au moins 5 caractères.")
        return value.strip()
    
    def validate_description(self, value):
        """Valide la description"""
        if len(value.strip()) < 50:
            raise serializers.ValidationError("La description doit contenir au moins 50 caractères.")
        return value.strip()
    
    def validate_image(self, value):
        """Valide l'image"""
        if value:
            if value.size > 5 * 1024 * 1024:  # 5MB
                raise serializers.ValidationError("L'image ne doit pas dépasser 5MB.")
            if not value.content_type.startswith('image/'):
                raise serializers.ValidationError("Le fichier doit être une image.")
        return value
    
    def create(self, validated_data):
        validated_data['porteur'] = self.context['request'].user
        return super().create(validated_data)


class ProjectListSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour la liste des projets
    """
    porteur = UserProfileSerializer(read_only=True)
    pourcentage_finance = serializers.ReadOnlyField()
    jours_restants = serializers.ReadOnlyField()
    nombre_investisseurs = serializers.ReadOnlyField()
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    
    class Meta:
        model = Project
        fields = (
            'id', 'titre', 'description', 'objectif', 'montant_actuel',
            'statut', 'statut_display', 'date_limite', 'date_creation',
            'porteur', 'image', 'pourcentage_finance', 'jours_restants',
            'nombre_investisseurs'
        )


class ProjectDetailSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les détails d'un projet
    """
    porteur = UserProfileSerializer(read_only=True)
    pourcentage_finance = serializers.ReadOnlyField()
    jours_restants = serializers.ReadOnlyField()
    nombre_investisseurs = serializers.ReadOnlyField()
    est_finance = serializers.ReadOnlyField()
    est_expire = serializers.ReadOnlyField()
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    
    class Meta:
        model = Project
        fields = (
            'id', 'titre', 'description', 'objectif', 'montant_actuel',
            'statut', 'statut_display', 'date_limite', 'date_creation',
            'porteur', 'image', 'pourcentage_finance', 'jours_restants',
            'nombre_investisseurs', 'est_finance', 'est_expire'
        )


class ProjectUpdateSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour la mise à jour des projets
    """
    class Meta:
        model = Project
        fields = ('titre', 'description', 'objectif', 'date_limite', 'image')
        
    def validate(self, attrs):
        project = self.instance
        if project.statut != 'EN_COURS':
            raise serializers.ValidationError(
                "Seuls les projets en cours peuvent être modifiés."
            )
        return attrs 