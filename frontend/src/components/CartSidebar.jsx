// src/components/CartSidebar.jsx
import { 
  Drawer, DrawerBody, DrawerHeader, 
  DrawerOverlay, DrawerContent, 
  Button, VStack, Text, Box, 
  useDisclosure, Modal, ModalOverlay, 
  ModalContent, ModalHeader, ModalBody, 
  ModalCloseButton, ModalFooter, HStack
} from '@chakra-ui/react';
import { useCart } from '../context/CartContext';
import PaymentForm from './PaymentForm';

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, removeFromCart, clearCart, setPaymentMethod } = useCart();
  const { 
    isOpen: isPaymentMethodOpen, 
    onOpen: onPaymentMethodOpen, 
    onClose: onPaymentMethodClose 
  } = useDisclosure();
  
  const { 
    isOpen: isCardFormOpen, 
    onOpen: onCardFormOpen, 
    onClose: onCardFormClose 
  } = useDisclosure();
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCashPayment = () => {
    setPaymentMethod('cash');
    onPaymentMethodClose();
    // Mostrar mensaje para pago en efectivo
  };

  const handleCardPayment = () => {
    setPaymentMethod('card');
    onPaymentMethodClose();
    onCardFormOpen();
  };

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Carrito de Compras</DrawerHeader>
          <DrawerBody>
            {cartItems.length === 0 ? (
              <Text>Tu carrito está vacío</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {cartItems.map(item => (
                  <Box key={item.id} borderBottomWidth="1px" pb={2}>
                    <Text fontWeight="bold">{item.name}</Text>
                    <Text>Cantidad: {item.quantity}</Text>
                    <Text>Precio: ${(item.price * item.quantity).toFixed(2)}</Text>
                    {item.stock && (
                      <Text fontSize="sm" color="gray.500">
                        Stock disponible: {item.stock}
                      </Text>
                    )}
                    <Button 
                      size="sm" 
                      colorScheme="red"
                      mt={1}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                ))}
                
                <Box mt={4}>
                  <Text fontSize="xl" fontWeight="bold">Total: ${total.toFixed(2)}</Text>
                </Box>
                
                <Button 
                  colorScheme="teal" 
                  mt={4}
                  onClick={onPaymentMethodOpen}
                >
                  Realizar Pedido
                </Button>
                <Button 
                  colorScheme="red" 
                  variant="outline"
                  onClick={clearCart}
                >
                  Vaciar Carrito
                </Button>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Modal de selección de método de pago */}
      <Modal isOpen={isPaymentMethodOpen} onClose={onPaymentMethodClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selecciona método de pago</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Button 
                colorScheme="blue" 
                width="100%"
                onClick={handleCardPayment}
              >
                Pago con Tarjeta
              </Button>
              
              <Button 
                colorScheme="gray" 
                width="100%"
                onClick={handleCashPayment}
                isDisabled
              >
                Pago en Efectivo
                <Text fontSize="xs" mt={1} color="red.500">
                  (No disponible actualmente)
                </Text>
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Text fontSize="sm" color="gray.500" textAlign="center" width="100%">
              El pago en efectivo no está disponible en este momento
            </Text>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Formulario de pago con tarjeta */}
      <PaymentForm 
        isOpen={isCardFormOpen} 
        onClose={onCardFormClose} 
        total={total}
      />
    </>
  );
}