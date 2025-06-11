from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse
from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static 

def home(request):
    return JsonResponse({"status": "API funcionando", "version": "1.0.0"})

urlpatterns = [
    path('api/auth/', include('users.urls')),
    path('api/', include('products.urls')),  # Cambiado a 'api/' en lugar de 'api/products/'
    path('api/orders/', include('orders.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)