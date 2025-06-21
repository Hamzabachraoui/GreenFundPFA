from django.db import models
from django.utils import timezone
from django.conf import settings
from decimal import Decimal


class Project(models.Model):
    STATUS_CHOICES = [
        ('EN_ATTENTE_VALIDATION', 'En attente de validation'),
        ('EN_COURS', 'En cours'),
        ('FINANCE', 'Financé'),
        ('ECHOUE', 'Échoué'),
    ]
    
    titre = models.CharField(max_length=200)
    description = models.TextField()
    objectif = models.DecimalField(max_digits=10, decimal_places=2, help_text="Montant objectif en euros")
    montant_actuel = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    statut = models.CharField(max_length=25, choices=STATUS_CHOICES, default='EN_ATTENTE_VALIDATION')
    date_limite = models.DateTimeField()
    date_creation = models.DateTimeField(auto_now_add=True)
    porteur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projets_portes',
        limit_choices_to={'role': 'PORTEUR'}
    )
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    
    # Nouveaux champs pour la localisation
    latitude = models.DecimalField(max_digits=15, decimal_places=12, blank=True, null=True, help_text="Latitude du projet")
    longitude = models.DecimalField(max_digits=15, decimal_places=12, blank=True, null=True, help_text="Longitude du projet")
    adresse = models.CharField(max_length=500, blank=True, null=True, help_text="Adresse complète du projet")
    
    # Nouveaux champs pour les documents
    business_plan = models.FileField(upload_to='projects/documents/', blank=True, null=True, help_text="Business plan du projet")
    plan_juridique = models.FileField(upload_to='projects/documents/', blank=True, null=True, help_text="Plan juridique et réglementaire du projet")
    
    class Meta:
        db_table = 'projects'
        verbose_name = 'Projet'
        verbose_name_plural = 'Projets'
        ordering = ['-date_creation']
    
    def __str__(self):
        return self.titre
    
    def save(self, *args, **kwargs):
        # Ensure date_limite is timezone-aware
        if self.date_limite and timezone.is_naive(self.date_limite):
            self.date_limite = timezone.make_aware(self.date_limite)
        super().save(*args, **kwargs)
    
    @property
    def pourcentage_finance(self):
        """Calcule le pourcentage de financement"""
        if self.objectif > 0:
            return min((self.montant_actuel / self.objectif) * 100, 100)
        return 0
    
    @property
    def est_finance(self):
        """Vérifie si le projet est financé"""
        return self.montant_actuel >= self.objectif
    
    @property
    def est_expire(self):
        """Vérifie si la date limite est dépassée"""
        return timezone.now() > self.date_limite
    
    @property
    def jours_restants(self):
        """Calcule le nombre de jours restants"""
        if self.est_expire:
            return 0
        delta = self.date_limite - timezone.now()
        return max(0, delta.days)
    
    @property
    def nombre_investisseurs(self):
        """Retourne le nombre d'investisseurs uniques"""
        return self.investissements.values('investisseur').distinct().count()
    
    @property
    def a_localisation(self):
        """Vérifie si le projet a des coordonnées GPS"""
        return self.latitude is not None and self.longitude is not None
    
    def update_status(self):
        """Met à jour le statut du projet"""
        # Ne pas changer le statut si le projet est en attente de validation
        if self.statut == 'EN_ATTENTE_VALIDATION':
            return
            
        if self.est_finance:
            self.statut = 'FINANCE'
        elif self.est_expire and not self.est_finance:
            self.statut = 'ECHOUE'
        else:
            self.statut = 'EN_COURS'
        self.save()
    
    def update_montant_actuel(self):
        """Met à jour le montant actuel basé sur les investissements réussis"""
        from investments.models import Investment
        total = Investment.objects.filter(
            projet=self,
            statut_paiement='REUSSI'
        ).aggregate(total=models.Sum('montant'))['total'] or Decimal('0.00')
        
        self.montant_actuel = total
        self.save()
        self.update_status()
    
    def valider_par_admin(self):
        """Valide le projet par l'admin (change le statut à EN_COURS)"""
        if self.statut == 'EN_ATTENTE_VALIDATION':
            self.statut = 'EN_COURS'
            self.save()
            return True
        return False 