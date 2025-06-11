from django.conf import settings
from django.db import models
from django.contrib.auth import get_user_model
from products.models import Product

User = get_user_model()

class Order(models.Model):
    PAYMENT_METHODS = (
        ('cash', 'Efectivo'),
        ('card', 'Tarjeta'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHODS)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Orden #{self.id} - {self.user.email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"