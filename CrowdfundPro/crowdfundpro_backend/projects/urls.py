from django.urls import path
from . import views, views_stats

urlpatterns = [
    path('', views.ProjectListView.as_view(), name='project-list'),
    path('user/', views.UserProjectsView.as_view(), name='user-projects'),
    path('<int:pk>/', views.ProjectDetailView.as_view(), name='project-detail'),
    path('<int:pk>/update_status/', views.update_project_status, name='project-update-status'),
    path('<int:pk>/validate/', views.validate_project, name='project-validate'),
    path('stats/porteur/', views_stats.porteur_stats, name='porteur-stats'),
    path('stats/investisseur/', views_stats.investisseur_stats, name='investisseur-stats'),
] 