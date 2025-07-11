# Generated by Django 5.1.2 on 2025-06-07 11:35

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('investments', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='investment',
            name='investisseur',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='investissements', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='investment',
            name='methode_paiement',
            field=models.CharField(choices=[('CARTE', 'Carte bancaire'), ('VIREMENT', 'Virement bancaire')], default='CARTE', max_length=20),
        ),
        migrations.AlterField(
            model_name='investment',
            name='statut_paiement',
            field=models.CharField(choices=[('EN_ATTENTE', 'En attente'), ('REUSSI', 'Réussi'), ('ECHOUE', 'Échoué')], default='EN_ATTENTE', max_length=20),
        ),
        migrations.AlterField(
            model_name='investment',
            name='stripe_client_secret',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='investment',
            name='stripe_payment_intent_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
