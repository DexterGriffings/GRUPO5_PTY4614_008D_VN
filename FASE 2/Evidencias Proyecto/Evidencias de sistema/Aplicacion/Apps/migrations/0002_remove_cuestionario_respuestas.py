# Generated by Django 5.1.2 on 2024-11-14 01:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Apps', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cuestionario',
            name='respuestas',
        ),
    ]