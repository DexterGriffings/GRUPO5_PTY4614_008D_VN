from django.urls import path
from django.contrib.auth import views as auth_views
from .views import loginview
from . import views

urlpatterns = [
    path('', loginview, name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='index'), name='logout'),

]
