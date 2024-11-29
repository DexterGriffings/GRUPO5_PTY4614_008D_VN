from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from .models import Cuestionario
import json
from .models import Colegio
from openpyxl import Workbook
from django.core.mail import send_mail
from django.conf import settings

def envio(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        subject = 'BeaFacil - Preoccupacion por bajo rendimiento'
        message = 'Preocupacion por bajo rendimmiento en el cuestionario, por favor contactar a la brevedad'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email]

        send_mail(subject, message, email_from, recipient_list)

        return JsonResponse({'status': 'success'})

    return JsonResponse({'status': 'fail'})


def completar_colegios(request): 
    if 'term' in request.GET:
        qs = Colegio.objects.filter(nombre__icontains=request.GET.get('term')) 
        nombres = list(qs.values_list('nombre', flat=True)) #Obtiene los nombres de los colegios
        return JsonResponse(nombres, safe=False)
    return JsonResponse([], safe=False)

def obtener_datos_cuestionario(request): #Obtiene los datos de los cuestionarios
    datos = Cuestionario.objects.all().values('nombre', 'rut','telefono', 'puntaje', 'colegio', 'correo')
    return JsonResponse(list(datos), safe=False)

def cuestionario(request):
    return render(request, 'cuestionario.html')

class CustomLoginView(LoginView):
    template_name = 'login.html'

def home_view(request):
    if request.user.is_authenticated:
        return render(request, 'CRM.html')
    else:
        return render(request, 'index.html')

@login_required
def authenticated_home_view(request):
    return render(request, 'admision.html')

@csrf_exempt
def guardar(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Verificar que todos los campos necesarios estén presentes
            required_fields = ['nombre', 'rut', 'correo', 'telefono', 'colegio', 'puntaje']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({'status': 'fail', 'error': f'Missing field: {field}'}, status=400)
            
            cuestionario = Cuestionario(
                nombre=data['nombre'],
                rut=data['rut'],
                correo=data['correo'],
                telefono=data['telefono'],
                colegio=data['colegio'],
                puntaje=data['puntaje']
            )
            cuestionario.save()
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'fail', 'error': str(e)}, status=400)
    return JsonResponse({'status': 'fail'}, status=400)

#--------------------------------------------
# Generar reporte de cuestionarios en Excel

def generar_excel(request):
    # Crear un libro de trabajo y una hoja
    wb = Workbook()
    ws = wb.active
    ws.title = "Cuestionarios"

    # Agregar encabezados
    ws.append(["Nombre", "Rut", "Telefono", "Puntaje", "Colegio"])

    # Obtener los datos de la base de datos
    cuestionarios = Cuestionario.objects.all().values_list('nombre', 'rut', 'telefono', 'puntaje', 'colegio')

    # Agregar los datos a la hoja
    for cuestionario in cuestionarios:
        ws.append(cuestionario)

    # Crear una respuesta HTTP con el archivo Excel
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=cuestionarios.xlsx'
    wb.save(response)
    return response

#--------------------------------------------
def generar_excel_desde_datos(request):
    if request.method == 'POST':
        # Obtener los datos enviados desde el cliente
        data = json.loads(request.body)

        # Crear un libro de trabajo y una hoja
        wb = Workbook()
        ws = wb.active
        ws.title = "Cuestionarios"

        # Agregar encabezados
        ws.append(["Nombre", "Rut", "Telefono", "Puntaje", "Colegio"])

        # Agregar los datos a la hoja
        for item in data:
            ws.append([item['nombre'], item['rut'], item['telefono'], item['puntaje'], item['colegio']])

        # Crear una respuesta HTTP con el archivo Excel
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=cuestionarios.xlsx'
        wb.save(response)
        return response
    return HttpResponse(status=400)