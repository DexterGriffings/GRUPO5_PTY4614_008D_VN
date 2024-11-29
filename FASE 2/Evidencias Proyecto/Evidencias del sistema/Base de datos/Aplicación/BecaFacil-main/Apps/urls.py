from django.urls import path
from .views import CustomLoginView
from . import views
from .views import home_view, authenticated_home_view, guardar,envio,generar_excel_desde_datos, completar_colegios,obtener_datos_cuestionario,generar_excel


urlpatterns = [
    path("", home_view, name="index"),
    path("cuestionario", views.cuestionario, name="cuestionario"),
    path('admision/', authenticated_home_view, name='admision'),
    path('guardar/', guardar, name='guardar'),
    path('completar_colegios/', completar_colegios, name='completar_colegios'),
    path('obtener-datos-cuestionario/', obtener_datos_cuestionario, name='obtener_datos_cuestionario'),
    path('generar-excel/', generar_excel, name='generar_excel'),
    path('generar-excel-desde-datos/', generar_excel_desde_datos, name='generar_excel_desde_datos'),
    path('envio/', envio, name='envio'),




]