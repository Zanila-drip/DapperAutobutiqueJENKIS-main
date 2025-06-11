from django.urls import path
from .views import OrderCreateView, OrderListView

urlpatterns = [
    path('', OrderCreateView.as_view(), name='order-create'),
    path('history/', OrderListView.as_view(), name='order-history'),
]