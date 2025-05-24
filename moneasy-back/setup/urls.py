from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('moneasy/', include('app.urls'), namespace='moneasy_back'),
]
