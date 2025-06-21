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


class IsAdminOrPorteurOrReadOnly(permissions.BasePermission):
    """
    Permission personnalisée pour permettre aux admins de tout faire,
    aux porteurs de gérer leurs projets, et à tous les utilisateurs authentifiés de lire
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and (request.user.is_superuser or request.user.role == 'PORTEUR')
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Les admins peuvent tout faire
        if request.user.is_superuser:
            return True
        # Les porteurs peuvent gérer leurs propres projets
        return obj.porteur == request.user


class ProjectListView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des projets
    """
    queryset = Project.objects.all()
    permission_classes = [IsAdminOrPorteurOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'porteur']
    search_fields = ['titre', 'description']
    ordering_fields = ['date_creation', 'montant_actuel', 'pourcentage_finance']
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        """
        Filtre les projets selon le rôle de l'utilisateur :
        - Admins : voient tous les projets
        - Porteurs : voient leurs propres projets + projets validés
        - Investisseurs : voient seulement les projets validés
        """
        queryset = Project.objects.all()
        
        # Si l'utilisateur n'est pas connecté, ne montrer que les projets validés
        if not self.request.user.is_authenticated:
            return queryset.exclude(statut='EN_ATTENTE_VALIDATION')
        
        # Si c'est un admin, montrer tous les projets
        if self.request.user.is_superuser:
            return queryset
        
        # Si c'est un porteur, montrer ses propres projets + projets validés
        if self.request.user.role == 'PORTEUR':
            return queryset.filter(
                Q(porteur=self.request.user) |  # Ses propres projets (tous statuts)
                ~Q(statut='EN_ATTENTE_VALIDATION')  # Projets validés des autres
            )
        
        # Si c'est un investisseur ou autre, ne montrer que les projets validés
        return queryset.exclude(statut='EN_ATTENTE_VALIDATION')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectCreateSerializer
        return ProjectListSerializer
    
    def perform_create(self, serializer):
        serializer.save(porteur=self.request.user)
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            print(f"❌ Erreur lors de la création: {str(e)}")
            print(f"❌ Données reçues: {request.data}")
            raise


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour consulter, modifier et supprimer un projet
    """
    queryset = Project.objects.all()
    permission_classes = [IsAdminOrPorteurOrReadOnly]
    
    def get_queryset(self):
        """
        Filtre les projets selon le rôle de l'utilisateur pour l'accès en détail
        """
        queryset = Project.objects.all()
        
        # Si l'utilisateur n'est pas connecté, ne montrer que les projets validés
        if not self.request.user.is_authenticated:
            return queryset.exclude(statut='EN_ATTENTE_VALIDATION')
        
        # Si c'est un admin, montrer tous les projets
        if self.request.user.is_superuser:
            return queryset
        
        # Si c'est un porteur, montrer ses propres projets + projets validés
        if self.request.user.role == 'PORTEUR':
            return queryset.filter(
                Q(porteur=self.request.user) |  # Ses propres projets (tous statuts)
                ~Q(statut='EN_ATTENTE_VALIDATION')  # Projets validés des autres
            )
        
        # Si c'est un investisseur ou autre, ne montrer que les projets validés
        return queryset.exclude(statut='EN_ATTENTE_VALIDATION')
    
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
        # Les porteurs voient tous leurs projets (y compris en attente de validation)
        # Les autres utilisateurs ne voient que leurs projets validés
        if self.request.user.role == 'PORTEUR':
            return Project.objects.filter(porteur=self.request.user)
        else:
            return Project.objects.filter(
                porteur=self.request.user,
                statut__in=['EN_COURS', 'FINANCE', 'ECHOUE']
            )
    
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
    # Filtrer les projets selon le rôle de l'utilisateur
    if request.user.is_superuser:
        # Admins voient toutes les statistiques
        queryset = Project.objects.all()
        projects_en_attente = Project.objects.filter(statut='EN_ATTENTE_VALIDATION').count()
    elif request.user.role == 'PORTEUR':
        # Porteurs voient leurs propres projets + projets validés des autres
        queryset = Project.objects.filter(
            Q(porteur=request.user) |  # Ses propres projets (tous statuts)
            ~Q(statut='EN_ATTENTE_VALIDATION')  # Projets validés des autres
        )
        # Pour les statistiques d'attente, seulement leurs propres projets
        projects_en_attente = Project.objects.filter(
            porteur=request.user,
            statut='EN_ATTENTE_VALIDATION'
        ).count()
    else:
        # Investisseurs et autres ne voient que les projets validés
        queryset = Project.objects.exclude(statut='EN_ATTENTE_VALIDATION')
        projects_en_attente = 0  # Les investisseurs ne voient pas les projets en attente
    
    total_projects = queryset.count()
    projects_en_cours = queryset.filter(statut='EN_COURS').count()
    projects_finances = queryset.filter(statut='FINANCE').count()
    projects_echoues = queryset.filter(statut='ECHOUE').count()
    
    # Calculate total funding
    from django.db.models import Sum
    total_funding = queryset.aggregate(
        total=Sum('montant_actuel')
    )['total'] or 0
    
    return Response({
        'total_projects': total_projects,
        'projects_en_attente': projects_en_attente,
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


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def validate_project(request, pk):
    """
    Vue pour valider un projet par l'admin (changer de EN_ATTENTE_VALIDATION à EN_COURS)
    """
    if not request.user.is_superuser:
        return Response(
            {'error': 'Permission non accordée'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        project = Project.objects.get(pk=pk)
        if project.statut != 'EN_ATTENTE_VALIDATION':
            return Response(
                {'error': 'Ce projet ne peut pas être validé (statut incorrect)'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        success = project.valider_par_admin()
        if success:
            return Response({
                'message': 'Projet validé avec succès',
                'nouveau_statut': project.statut
            })
        else:
            return Response(
                {'error': 'Erreur lors de la validation du projet'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    except Project.DoesNotExist:
        return Response(
            {'error': 'Projet non trouvé'}, 
            status=status.HTTP_404_NOT_FOUND
        ) 