from rest_framework import generics, permissions
from .models import Order, OrderItem
from .serializers import OrderSerializer
from rest_framework.response import Response
from products.models import Product
from rest_framework import status

class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Agregar el método de pago a los datos
        request.data['payment_method'] = request.data.get('payment_method', 'card')
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            self.perform_create(serializer)
        except Product.DoesNotExist:
            return Response(
                {"detail": "Uno o más productos no existen"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        order_items = self.request.data.get('items', [])
        
        # Crear OrderItems y actualizar stock
        for item in order_items:
            try:
                product = Product.objects.get(id=item['product'])
                quantity = item['quantity']
                
                # Verificar stock suficiente
                if product.stock < quantity:
                    raise ValueError(f"Stock insuficiente para {product.name}")
                
                # Crear OrderItem
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=product.price
                )
                
                # Actualizar stock
                product.stock -= quantity
                product.save()
                
            except Product.DoesNotExist:
                # Eliminar la orden si hay productos no encontrados
                order.delete()
                raise
            except ValueError as e:
                # Eliminar la orden si hay problemas de stock
                order.delete()
                raise ValueError(str(e))

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)