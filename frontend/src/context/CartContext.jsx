// context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { createOrder, updateProductStock } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const processPayment = async (paymentDetails) => {
    setIsPaymentProcessing(true);
    try {
      // Crear la orden
      const orderData = {
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity
        })),
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        payment_method: paymentMethod,
        ...paymentDetails
      };
      
      await createOrder(orderData);
      
      // Actualizar el stock de los productos
      for (const item of cartItems) {
        await updateProductStock(item.id, {
          stock: item.stock - item.quantity
        });
      }
      
      // Limpiar carrito después del pago exitoso
      clearCart();
      setPaymentMethod(null);
      
      return true;
    } catch (error) {
      console.error("Error procesando el pago:", error);
      return false;
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      paymentMethod,
      setPaymentMethod,
      processPayment,
      isPaymentProcessing
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);