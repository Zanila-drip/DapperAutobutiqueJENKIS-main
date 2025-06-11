// src/components/PaymentForm.jsx
import { 
    Modal, ModalOverlay, ModalContent, ModalHeader, 
    ModalBody, ModalCloseButton, VStack, Input, 
    Button, FormControl, FormLabel, Text, 
    useToast, HStack, Box
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { useCart } from '../context/CartContext';
  
  export default function PaymentForm({ isOpen, onClose, total }) {
    const { processPayment, isPaymentProcessing } = useCart();
    const [cardDetails, setCardDetails] = useState({
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });
    const toast = useToast();
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCardDetails(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async () => {
      // Validación básica
      if (!cardDetails.cardName || !cardDetails.cardNumber || 
          !cardDetails.expiryDate || !cardDetails.cvv) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos",
          status: "error",
          duration: 3000,
        });
        return;
      }
  
      const success = await processPayment(cardDetails);
      
      if (success) {
        toast({
          title: "Pago exitoso",
          description: "Tu pedido ha sido procesado correctamente",
          status: "success",
          duration: 5000,
        });
        onClose();
      } else {
        toast({
          title: "Error en el pago",
          description: "Ocurrió un error al procesar tu pago",
          status: "error",
          duration: 5000,
        });
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pago con Tarjeta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} mb={4}>
              <Box width="100%" p={3} bg="teal.50" borderRadius="md">
                <Text fontSize="lg" fontWeight="bold">Total a pagar: ${total.toFixed(2)}</Text>
              </Box>
              
              <FormControl>
                <FormLabel>Nombre del titular</FormLabel>
                <Input
                  name="cardName"
                  placeholder="Como aparece en la tarjeta"
                  value={cardDetails.cardName}
                  onChange={handleInputChange}
                />
              </FormControl>
  
              <FormControl>
                <FormLabel>Número de tarjeta</FormLabel>
                <Input
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                />
              </FormControl>
  
              <HStack spacing={4} width="100%">
                <FormControl>
                  <FormLabel>Fecha de vencimiento</FormLabel>
                  <Input
                    name="expiryDate"
                    placeholder="MM/AA"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                  />
                </FormControl>
  
                <FormControl>
                  <FormLabel>CVV</FormLabel>
                  <Input
                    name="cvv"
                    placeholder="123"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </HStack>
            </VStack>
  
            <Button
              colorScheme="teal"
              width="100%"
              onClick={handleSubmit}
              isLoading={isPaymentProcessing}
              loadingText="Procesando pago..."
            >
              Pagar ahora
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }