from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Project
from .serializers import (
    ProjectCreateSerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
    ProjectUpdateSerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class IsPorteurOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour permettre aux porteurs de créer des projets
    et à tous les utilisateurs authentifiés de lire
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'PORTEUR'
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.porteur == request.user


class ProjectListView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des projets
    """
    queryset = Project.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'porteur']
    search_fields = ['titre', 'description']
    ordering_fields = ['date_creation', 'montant_actuel', 'pourcentage_finance']
    pagination_class = StandardResultsSetPagination
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectCreateSerializer
        return ProjectListSerializer
    
    def perform_create(self, serializer):
        serializer.save(porteur=self.request.user)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour consulter, modifier et supprimer un projet
    """
    queryset = Project.objects.all()
    permission_classes = [IsPorteurOrReadOnly]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProjectUpdateSerializer
        return ProjectDetailSerializer


class UserProjectsView(generics.ListAPIView):
    """
    Vue pour lister les projets de l'utilisateur connecté
    """
    serializer_class = ProjectListSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None  # Désactive la pagination pour cette vue
    
    def get_queryset(self):
        return Project.objects.filter(porteur=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        print("📦 Données sérialisées:", serializer.data)  # Debug log
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def project_stats(request):
    """
    Vue pour obtenir les statistiques générales des projets
    """
    total_projects = Project.objects.count()
    projects_en_cours = Project.objects.filter(statut='EN_COURS').count()
    projects_finances = Project.objects.filter(statut='FINANCE').count()
    projects_echoues = Project.objects.filter(statut='ECHOUE').count()
    
    # Calculate total funding
    from django.db.models import Sum
    total_funding = Project.objects.aggregate(
        total=Sum('montant_actuel')
    )['total'] or 0
    
    return Response({
        'total_projects': total_projects,
        'projects_en_cours': projects_en_cours,
        'projects_finances': projects_finances,
        'projects_echoues': projects_echoues,
        'total_funding': total_funding,
        'success_rate': (projects_finances / total_projects * 100) if total_projects > 0 else 0
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_project_status(request, pk):
    """
    Vue pour mettre à jour manuellement le statut d'un projet (admin only)
    """
    if not request.user.is_superuser:
        return Response(
            {'error': 'Permission non accordée'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        project = Project.objects.get(pk=pk)
        project.update_status()
        return Response({
            'message': 'Statut mis à jour',
            'nouveau_statut': project.statut
        })
    except Project.DoesNotExist:
        return Response(
            {'error': 'Projet non trouvé'}, 
            status=status.HTTP_404_NOT_FOUND
        ) 