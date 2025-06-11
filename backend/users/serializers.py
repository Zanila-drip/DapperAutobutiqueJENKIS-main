from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .models import CustomUser

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Añadir claims personalizados al token JWT
        token['user_type'] = user.user_type
        token['user_id'] = user.id
        token['is_superuser'] = user.is_superuser
        token['is_staff'] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Añadir datos adicionales a la respuesta
        data['user_type'] = self.user.user_type
        data['user_id'] = self.user.id
        data['is_superuser'] = self.user.is_superuser
        data['is_staff'] = self.user.is_staff
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type', 'phone', 'address', 'is_superuser', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True}
        }

# users/serializers.py
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'phone', 'address']
        extra_kwargs = {
            'user_type': {'read_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', ''),
            user_type='customer'
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type', 'phone', 'address']
        read_only_fields = ['email', 'user_type']