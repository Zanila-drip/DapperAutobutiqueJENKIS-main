from rest_framework import generics, permissions
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from rest_framework.exceptions import PermissionDenied

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]  # Acceso público para listar
        return [permissions.IsAuthenticated(), permissions.IsAdminUser()]  # Requiere admin para crear

    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category')
        if category:
            if category == 'sin-categoria':
                queryset = queryset.filter(category__isnull=True)
            else:
                queryset = queryset.filter(category__name=category)
        return queryset

    def perform_create(self, serializer):
        serializer.save()
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]  # Acceso público para listar categorías
        return [permissions.IsAuthenticated(), permissions.IsAdminUser()]  # Requiere admin para crear

class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]  # Requiere autenticación y admin