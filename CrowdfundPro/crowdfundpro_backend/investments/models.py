from django.db import models
from django.conf import settings
from django.utils import timezone
from decimal import Decimal
from users.models import User
from projects.models import Project


class Investment(models.Model):
    STATUT_CHOICES = (
        ('EN_ATTENTE', 'En attente'),
        ('REUSSI', 'Réussi'),
        ('ECHOUE', 'Échoué'),
    )
    
    METHODE_PAIEMENT_CHOICES = (
        ('CARTE', 'Carte bancaire'),
        ('VIREMENT', 'Virement bancaire'),
    )
    
    investisseur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='investissements'
    )
    projet = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='investissements'
    )
    montant = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    date_investissement = models.DateTimeField(
        default=timezone.now
    )
    statut_paiement = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='EN_ATTENTE'
    )
    methode_paiement = models.CharField(
        max_length=20,
        choices=METHODE_PAIEMENT_CHOICES,
        default='CARTE'
    )
    stripe_payment_intent_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    stripe_client_secret = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    
    class Meta:
        db_table = 'investments'
        verbose_name = 'Investissement'
        verbose_name_plural = 'Investissements'
        ordering = ['-date_investissement']
    
    def __str__(self):
        return f"{self.investisseur.email} - {self.projet.titre} - {self.montant}€"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update project amount when investment status changes to 'REUSSI'
        if self.statut_paiement == 'REUSSI':
            self.projet.update_montant_actuel()
    
    @property
    def is_successful(self):
        return self.statut_paiement == 'REUSSI' 