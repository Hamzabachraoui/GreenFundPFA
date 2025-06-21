from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, F, ExpressionWrapper, FloatField, Q
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from .models import Project
from investments.models import Investment

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def porteur_stats(request):
    """
    Statistiques pour le dashboard du porteur de projet
    """
    user = request.user
    if user.role != 'PORTEUR':
        return Response({'error': 'Accès non autorisé'}, status=403)

    # Projets de l'utilisateur
    projects = Project.objects.filter(porteur=user)
    
    # Statistiques de base
    total_projects = projects.count()
    total_funding = projects.aggregate(
        total=Sum('montant_actuel', default=Decimal('0.00'))
    )['total']
    
    financed_projects = projects.filter(statut='FINANCE').count()
    success_rate = (financed_projects / total_projects * 100) if total_projects > 0 else 0

    # Top projets par financement
    top_projects = projects.order_by('-montant_actuel')[:5].values('titre', 'montant_actuel')
    top_projects_data = [
        {'name': p['titre'], 'funding': float(p['montant_actuel'])}
        for p in top_projects
    ]

    # Statistiques mensuelles
    six_months_ago = timezone.now() - timedelta(days=180)
    monthly_stats = projects.filter(
        date_creation__gte=six_months_ago
    ).annotate(
        month=TruncMonth('date_creation')
    ).values('month').annotate(
        newProjects=Count('id'),
        totalFunding=Sum('montant_actuel'),
        newInvestments=Count('investissements')
    ).order_by('month')

    monthly_stats_data = [
        {
            'month': stats['month'].strftime('%b'),
            'newProjects': stats['newProjects'],
            'totalFunding': float(stats['totalFunding'] or 0),
            'newInvestments': stats['newInvestments']
        }
        for stats in monthly_stats
    ]

    # Investissements récents
    recent_investments = Investment.objects.filter(
        projet__porteur=user
    ).select_related(
        'projet', 'investisseur'
    ).order_by('-date_investissement')[:5]

    recent_investments_data = [
        {
            'projectName': inv.projet.titre,
            'amount': float(inv.montant),
            'date': inv.date_investissement.isoformat(),
            'investorName': inv.investisseur.username
        }
        for inv in recent_investments
    ]

    return Response({
        'totalProjects': total_projects,
        'totalFunding': float(total_funding),
        'successRate': round(success_rate, 1),
        'topProjects': top_projects_data,
        'monthlyStats': monthly_stats_data,
        'recentInvestments': recent_investments_data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def investisseur_stats(request):
    """
    Statistiques pour le dashboard de l'investisseur
    """
    user = request.user
    if user.role != 'INVESTISSEUR':
        return Response({'error': 'Accès non autorisé'}, status=403)

    # Investissements de l'utilisateur
    investments = Investment.objects.filter(investisseur=user)
    
    # Statistiques de base
    total_invested = investments.aggregate(
        total=Sum('montant', default=Decimal('0.00'))
    )['total']
    
    number_of_investments = investments.count()
    average_investment = total_invested / number_of_investments if number_of_investments > 0 else 0

    # Calculer le ROI potentiel (exemple simplifié)
    successful_projects = investments.filter(
        projet__statut='FINANCE'
    ).count()
    potential_roi = (successful_projects / number_of_investments * 25) if number_of_investments > 0 else 0

    # Distribution du portfolio par statut de projet
    portfolio_distribution = investments.values(
        'projet__statut'
    ).annotate(
        total=Sum('montant')
    ).order_by('-total')

    colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6B7280', '#8B5CF6']
    portfolio_data = [
        {
            'name': item['projet__statut'],
            'value': float(item['total']),
            'color': colors[i % len(colors)]
        }
        for i, item in enumerate(portfolio_distribution)
    ]

    # Historique des investissements
    six_months_ago = timezone.now() - timedelta(days=180)
    investment_history = investments.filter(
        date_investissement__gte=six_months_ago
    ).annotate(
        month=TruncMonth('date_investissement')
    ).values('month').annotate(
        amount=Sum('montant')
    ).order_by('month')

    history_data = [
        {
            'date': stats['month'].strftime('%b %Y'),
            'amount': float(stats['amount'])
        }
        for stats in investment_history
    ]

    return Response({
        'totalInvested': float(total_invested),
        'numberOfInvestments': number_of_investments,
        'potentialROI': round(potential_roi, 1),
        'averageInvestment': float(average_investment),
        'portfolioDistribution': portfolio_data,
        'investmentHistory': history_data
    }) 