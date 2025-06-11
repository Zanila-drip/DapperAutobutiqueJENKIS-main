from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

class CustomUserManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_type', 'admin')  # <--- cobro muy barato

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('user_type') != 'admin':
            raise ValueError('Superuser must have user_type="admin".')

        return super().create_superuser(username, email, password, **extra_fields)

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('customer', 'Customer'),
    )
    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default='customer'
    )
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    objects = CustomUserManager()

    def is_admin(self):
        return self.user_type == 'admin' or self.is_superuser

    class Meta:
        permissions = [
            ("manage_users", "Can manage users"),
            ("manage_products", "Can manage products"),
            ("manage_categories", "Can manage categories"),
        ]