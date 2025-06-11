// src/services/api.js
import axios from 'axios';

const apiUrl = window.env?.VITE_API_URL || 'http://localhost:8000';
const api = axios.create({
    baseURL: apiUrl + '/api',
});

// Interceptor para agregar el token JWT a cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = (data) => api.post('/auth/register/', {
    username: data.username,
    email: data.email,
    password: data.password,
    phone: data.phone,
    address: data.address
});

export const loginUser = async (data) => {
    try {
        const response = await api.post('/auth/login/', {
            email: data.email,
            password: data.password
        });
        
        // IMPORTANTE: Devolver los datos adicionales de la respuesta
        return {
            data: {
                access: response.data.access,
                refresh: response.data.refresh,
                // Asegurar que estos campos vienen del backend
                user_type: response.data.user_type,
                user_id: response.data.user_id
            }
        };
    } catch (error) {
        console.error("Error completo:", error.response?.data);
        throw error;
    }
};

// Funciones de productos
export const getProducts = () => api.get('/products/');
export const getProduct = (id) => api.get(`/products/${id}/`);
export const createProduct = (productData) => api.post('/products/', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}/`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}/`);

// Funciones de categorías
export const getCategories = () => api.get('/categories/');
export const createCategory = (categoryData) => api.post('/categories/', categoryData);
export const deleteCategory = (id) => api.delete(`/categories/${id}/`);

// Funciones de usuarios (actualizadas para usar el endpoint correcto)
export const getUsers = () => api.get('/auth/users/');
export const deleteUser = (id) => api.delete(`/auth/users/${id}/`);

// Funciones de órdenes
export const getOrders = () => api.get('/orders/');
export const createOrder = (orderData) => {
    // Asegurarse de que el método de pago está incluido
    const data = {
      ...orderData,
      items: orderData.items.map(item => ({
        product: item.product,  // Asegurar que es el ID del producto
        quantity: item.quantity
      }))
    };
    
    return api.post('/orders/', data);
  };
  
export const updateProductStock = (id, stockData) => {
    return api.patch(`/products/${id}/`, stockData);
  };