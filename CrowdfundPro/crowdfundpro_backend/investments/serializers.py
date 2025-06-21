from rest_framework import serializers
from .models import Investment
from projects.serializers import ProjectListSerializer
from users.serializers import UserProfileSerializer


class InvestmentCreateSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour créer un investissement
    """
    class Meta:
        model = Investment
        fields = ('projet', 'montant')
    
    def validate_montant(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le montant doit être supérieur à 0.")
        if value < 1:  # Minimum investment
            raise serializers.ValidationError("Le montant minimum d'investissement est de 1 DH.")
        return value
    
    def validate_projet(self, value):
        if value.statut != 'EN_COURS':
            raise serializers.ValidationError("Ce projet n'accepte plus d'investissements.")
        if value.est_expire:
            raise serializers.ValidationError("Ce projet a expiré.")
        return value
    
    def validate(self, attrs):
        user = self.context['request'].user
        projet = attrs['projet']
        
        if user.role != 'INVESTISSEUR':
            raise serializers.ValidationError("Seuls les investisseurs peuvent investir.")
        
        if projet.porteur == user:
            raise serializers.ValidationError("Vous ne pouvez pas investir dans votre propre projet.")
        
        return attrs
    
    def create(self, validated_data):
        validated_data['investisseur'] = self.context['request'].user
        return super().create(validated_data)


class InvestmentListSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour lister les investissements
    """
    projet = ProjectListSerializer(read_only=True)
    investisseur = UserProfileSerializer(read_only=True)
    statut = serializers.CharField(source='statut_paiement', read_only=True)
    statut_display = serializers.CharField(source='get_statut_paiement_display', read_only=True)
    methode_paiement_display = serializers.CharField(source='get_methode_paiement_display', read_only=True)
    
    class Meta:
        model = Investment
        fields = (
            'id', 'projet', 'investisseur', 'montant', 'date_investissement',
            'methode_paiement', 'methode_paiement_display', 'statut_paiement',
            'statut', 'statut_display'
        )


class InvestmentDetailSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les détails d'un investissement
    """
    projet = ProjectListSerializer(read_only=True)
    investisseur = UserProfileSerializer(read_only=True)
    statut = serializers.CharField(source='statut_paiement', read_only=True)
    statut_display = serializers.CharField(source='get_statut_paiement_display', read_only=True)
    methode_paiement_display = serializers.CharField(source='get_methode_paiement_display', read_only=True)
    
    class Meta:
        model = Investment
        fields = (
            'id', 'projet', 'investisseur', 'montant', 'date_investissement',
            'methode_paiement', 'methode_paiement_display', 'statut_paiement',
            'statut', 'statut_display', 'stripe_payment_intent_id'
        )


class PaymentIntentSerializer(serializers.Serializer):
    """
    Sérialiseur pour créer un payment intent Stripe
    """
    investment_id = serializers.IntegerField()
    
    def validate_investment_id(self, value):
        try:
            investment = Investment.objects.get(id=value)
            if investment.statut_paiement != 'EN_ATTENTE':
                raise serializers.ValidationError("Cet investissement a déjà été traité.")
            return value
        except Investment.DoesNotExist:
            raise serializers.ValidationError("Investissement non trouvé.")


class PaymentConfirmationSerializer(serializers.Serializer):
    """
    Sérialiseur pour confirmer un paiement
    """
    payment_intent_id = serializers.CharField()
    investment_id = serializers.IntegerField()
    
    def validate(self, attrs):
        try:
            investment = Investment.objects.get(id=attrs['investment_id'])
            if investment.stripe_payment_intent_id != attrs['payment_intent_id']:
                raise serializers.ValidationError("Payment intent ID ne correspond pas.")
            return attrs
        except Investment.DoesNotExist:
            raise serializers.ValidationError("Investissement non trouvé.") 