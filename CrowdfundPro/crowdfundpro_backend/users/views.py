from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .models import User
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserLoginSerializer,
    UserPublicSerializer,
    UserSerializer,
    LoginSerializer
)
from rest_framework.views import APIView
import logging

User = get_user_model()

logger = logging.getLogger(__name__)


class UserRegistrationView(generics.CreateAPIView):
    """
    Vue pour l'inscription des utilisateurs
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Inscription réussie',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class UserProfileView(APIView):
    def get(self, request):
        try:
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            logger.info(f"Tentative de connexion - données reçues: {request.data}")
            
            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid():
                email = serializer.validated_data['email']
                password = serializer.validated_data['password']
                
                logger.info(f"Tentative d'authentification pour l'email: {email}")
                user = authenticate(request, email=email, password=password)
                
                if user:
                    logger.info(f"Authentification réussie pour l'utilisateur: {user.email}")
                    refresh = RefreshToken.for_user(user)
                    user_serializer = UserSerializer(user)
                    
                    return Response({
                        'user': user_serializer.data,
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    })
                else:
                    logger.warning(f"Échec d'authentification pour l'email: {email}")
                    return Response(
                        {'error': 'Email ou mot de passe incorrect'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            
            logger.error(f"Erreurs de validation: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.exception("Erreur lors de la connexion")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserLogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    """
    Vue pour lister les utilisateurs (admin seulement)
    """
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'ADMIN':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)


class UserPublicView(generics.RetrieveAPIView):
    """
    Vue pour récupérer les informations publiques d'un utilisateur
    """
    queryset = User.objects.all()
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.AllowAny]  # Accessible à tous

    def get_queryset(self):
        """Filtrer pour ne retourner que les porteurs de projet"""
        return User.objects.filter(role='PORTEUR') 