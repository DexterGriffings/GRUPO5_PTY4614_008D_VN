from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    rut = models.CharField(max_length=12, unique=True)
    school = models.CharField(max_length=100)
    course = models.CharField(max_length=100)