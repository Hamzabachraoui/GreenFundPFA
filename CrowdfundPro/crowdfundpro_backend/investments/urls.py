from django.urls import path
from . import views

urlpatterns = [
    path('', views.InvestmentCreateView.as_view(), name='investment-create'),
    path('list/', views.InvestmentListView.as_view(), name='investment-list'),
    path('<int:pk>/', views.InvestmentDetailView.as_view(), name='investment-detail'),
    path('create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),
    path('confirm-payment/', views.confirm_payment, name='confirm-payment'),
    path('dashboard/', views.investment_dashboard, name='investment-dashboard'),
] 