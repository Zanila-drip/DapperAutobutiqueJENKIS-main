// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/shop" element={
              <PrivateRoute>
                <Shop />
              </PrivateRoute>
            } />
            
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}