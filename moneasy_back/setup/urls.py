
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('moneasy_api.urls', namespace='moneasy_api'))
    
]
