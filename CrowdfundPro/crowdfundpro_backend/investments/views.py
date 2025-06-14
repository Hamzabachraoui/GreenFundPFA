import stripe
from decimal import Decimal
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Investment
from .serializers import (
    InvestmentCreateSerializer,
    InvestmentListSerializer,
    InvestmentDetailSerializer,
    PaymentIntentSerializer,
    PaymentConfirmationSerializer
)

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class IsInvestisseurOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour les investisseurs
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'INVESTISSEUR'


class InvestmentCreateView(generics.CreateAPIView):
    """
    Vue pour créer un investissement
    """
    serializer_class = InvestmentCreateSerializer
    permission_classes = [IsInvestisseurOrReadOnly]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        investment = serializer.save()
        
        return Response({
            'message': 'Investissement créé avec succès',
            'investment': InvestmentDetailSerializer(investment).data
        }, status=status.HTTP_201_CREATED)


class InvestmentListView(generics.ListAPIView):
    """
    Vue pour lister les investissements
    """
    serializer_class = InvestmentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Investment.objects.all()
        elif user.role == 'INVESTISSEUR':
            return Investment.objects.filter(investisseur=user)
        elif user.role == 'PORTEUR':
            # Porteurs can see investments in their projects
            return Investment.objects.filter(projet__porteur=user)
        return Investment.objects.none()


class InvestmentDetailView(generics.RetrieveAPIView):
    """
    Vue pour consulter les détails d'un investissement
    """
    serializer_class = InvestmentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Investment.objects.all()
        elif user.role == 'INVESTISSEUR':
            return Investment.objects.filter(investisseur=user)
        elif user.role == 'PORTEUR':
            return Investment.objects.filter(projet__porteur=user)
        return Investment.objects.none()


@api_view(['POST'])
@permission_classes([IsInvestisseurOrReadOnly])
def create_payment_intent(request):
    """
    Vue pour créer un payment intent Stripe
    """
    serializer = PaymentIntentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        investment = Investment.objects.get(id=serializer.validated_data['investment_id'])
        
        # Verify that the user owns this investment
        if investment.investisseur != request.user:
            return Response(
                {'error': 'Permission non accordée'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Create Stripe payment intent
        intent = stripe.PaymentIntent.create(
            amount=int(investment.montant * 100),  # Stripe uses cents
            currency='eur',
            metadata={
                'investment_id': investment.id,
                'project_title': investment.projet.titre,
                'investor_email': investment.investisseur.email
            }
        )
        
        # Save payment intent details to investment
        investment.stripe_payment_intent_id = intent.id
        investment.stripe_client_secret = intent.client_secret
        investment.save()
        
        return Response({
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        })
        
    except Investment.DoesNotExist:
        return Response(
            {'error': 'Investissement non trouvé'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except stripe.error.StripeError as e:
        return Response(
            {'error': f'Erreur Stripe: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsInvestisseurOrReadOnly])
def confirm_payment(request):
    """
    Vue pour confirmer un paiement réussi
    """
    serializer = PaymentConfirmationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        investment = Investment.objects.get(id=serializer.validated_data['investment_id'])
        
        # Verify that the user owns this investment
        if investment.investisseur != request.user:
            return Response(
                {'error': 'Permission non accordée'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Retrieve payment intent from Stripe
        intent = stripe.PaymentIntent.retrieve(
            serializer.validated_data['payment_intent_id']
        )
        
        if intent.status == 'succeeded':
            investment.statut_paiement = 'REUSSI'
            investment.save()
            
            return Response({
                'message': 'Paiement confirmé avec succès',
                'investment': InvestmentDetailSerializer(investment).data
            })
        else:
            investment.statut_paiement = 'ECHOUE'
            investment.save()
            
            return Response({
                'error': 'Le paiement a échoué'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Investment.DoesNotExist:
        return Response(
            {'error': 'Investissement non trouvé'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except stripe.error.StripeError as e:
        return Response(
            {'error': f'Erreur Stripe: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def investment_dashboard(request):
    """
    Vue pour le tableau de bord des investissements
    """
    user = request.user
    
    if user.role == 'INVESTISSEUR':
        investments = Investment.objects.filter(investisseur=user)
        total_invested = investments.filter(statut_paiement='REUSSI').aggregate(
            total=models.Sum('montant')
        )['total'] or Decimal('0.00')
        
        successful_investments = investments.filter(statut_paiement='REUSSI').count()
        pending_investments = investments.filter(statut_paiement='EN_ATTENTE').count()
        failed_investments = investments.filter(statut_paiement='ECHOUE').count()
        
        return Response({
            'total_invested': total_invested,
            'successful_investments': successful_investments,
            'pending_investments': pending_investments,
            'failed_investments': failed_investments,
            'investments': InvestmentListSerializer(investments, many=True).data
        })
    
    elif user.role == 'PORTEUR':
        from django.db.models import Sum
        investments = Investment.objects.filter(projet__porteur=user)
        total_received = investments.filter(statut_paiement='REUSSI').aggregate(
            total=Sum('montant')
        )['total'] or Decimal('0.00')
        
        return Response({
            'total_received': total_received,
            'total_investments': investments.count(),
            'successful_investments': investments.filter(statut_paiement='REUSSI').count(),
            'investments': InvestmentListSerializer(investments, many=True).data
        })
    
    return Response({'error': 'Type d\'utilisateur non supporté'}, status=status.HTTP_400_BAD_REQUEST) 