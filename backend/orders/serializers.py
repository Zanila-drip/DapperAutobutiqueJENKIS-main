from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_method = serializers.CharField(write_only=True)  # Asegúrate de incluir esto
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'total', 'payment_method', 'created_at', 'items']
        read_only_fields = ['user', 'created_at']