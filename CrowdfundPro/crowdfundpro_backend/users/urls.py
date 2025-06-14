from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserLoginView,
    UserRegistrationView,
    UserLogoutView,
    UserProfileView,
    UserListView,
)

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='login'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('list/', UserListView.as_view(), name='user-list'),
] 