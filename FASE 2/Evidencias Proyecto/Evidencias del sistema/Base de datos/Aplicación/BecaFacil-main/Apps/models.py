from django.db import models

class Cuestionario(models.Model):
    nombre = models.CharField(max_length=100)
    rut = models.CharField(max_length=12)
    correo = models.EmailField()
    telefono = models.CharField(max_length=15)
    colegio = models.CharField(max_length=100)
    puntaje = models.IntegerField()  # Para almacenar el puntaje obtenido en el cuestionario
    
    def __str__(self):
        return self.nombre
    
class Colegio(models.Model):
    nombre = models.CharField(max_length=150)

    def __str__(self):
        return self.nombre