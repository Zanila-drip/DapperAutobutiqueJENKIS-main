// pages/Login.jsx
import { useState } from 'react';
import { Box, Button, Input, VStack, useToast } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // La redirección ahora se maneja completamente en AuthContext
    } catch (error) {
      console.error("Error de login:", error);
      toast({
        title: "Error de autenticación",
        description: "Credenciales incorrectas o problema con el servidor",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  return (
    <Box p={4} maxW="400px" mx="auto">
      <VStack spacing={4} as="form" onSubmit={handleSubmit}>
        <Input
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" width="full" colorScheme="teal">
          Iniciar sesión
        </Button>
      </VStack>
    </Box>
  );
}