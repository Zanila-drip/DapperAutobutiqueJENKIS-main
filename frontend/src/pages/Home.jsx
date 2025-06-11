// pages/Home.jsx
import { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { getProducts } from '../services/api';

export default function Home() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await getProducts();
        setStatus('connected');
        console.log('Datos recibidos:', response.data);
      } catch (err) {
        setStatus('error');
        console.error('Error de conexión:', err);
      }
    };
    testConnection();
  }, []);

  return (
    <Box p={4}>
      <Text fontSize="xl">Estado de conexión: {status}</Text>
      {status === 'error' && (
        <Text color="red.500">
          No se pudo conectar al backend. Verifica que esté corriendo en http://localhost:8000
        </Text>
      )}
    </Box>
  );
}