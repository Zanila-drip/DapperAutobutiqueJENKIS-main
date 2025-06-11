// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        token,
        userType: payload.user_type,
        userId: payload.user_id,
        isSuperuser: payload.is_superuser,   //Por eso me mama la autenticacion por google
        isStaff: payload.is_staff
      });
    } catch (error) {
      console.error("Error decodificando token:", error);
    }
  }
  setLoading(false);
}, []);

  const login = async (credentials) => {
  try {
    const response = await loginUser(credentials);
    localStorage.setItem('token', response.data.access);

    // Usar los datos del token decodificado
    const payload = JSON.parse(atob(response.data.access.split('.')[1]));

    setUser({
      token: response.data.access,
      userType: payload.user_type,
      userId: payload.user_id,
      isSuperuser: payload.is_superuser,   // <--- NUEVO
      isStaff: payload.is_staff           // <--- NUEVO
    });

    // Redirigir basado en privilegios
    if (payload.is_superuser || payload.user_type === 'admin') {
      navigate('/admin');
    } else {
      navigate('/shop');
    }

  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};