from django import forms
from .models import Cuestionario

class CuestionarioForm(forms.ModelForm):
    class Meta:
        model = Cuestionario
        fields = ['nombre', 'rut', 'correo', 'telefono', 'colegio']