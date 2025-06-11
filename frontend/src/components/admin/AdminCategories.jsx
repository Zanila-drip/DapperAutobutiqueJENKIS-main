// components/admin/AdminCategories.jsx
import { useState, useEffect } from 'react';
import { 
  Table, Thead, Tbody, Tr, Th, Td, 
  Input, Button, HStack, IconButton,
  useToast, Box, Text, Spinner
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { 
  getCategories, 
  createCategory, 
  deleteCategory 
} from '../../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error cargando categorías");
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría no puede estar vacío",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await createCategory({ name: newCategory });
      setNewCategory('');
      await loadCategories();
      
      toast({
        title: "Categoría creada",
        status: "success",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        setLoading(true);
        await deleteCategory(id);
        await loadCategories();
        
        toast({
          title: "Categoría eliminada",
          status: "success",
          duration: 2000,
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la categoría",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Cargando categorías...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Text color="red.500" textAlign="center" py={10}>
        {error}
      </Text>
    );
  }

  return (
    <Box>
      <HStack mb={6}>
        <Input
          placeholder="Nombre de nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
        />
        <Button 
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={handleCreateCategory}
          isLoading={loading}
        >
          Añadir
        </Button>
      </HStack>

      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map(category => (
            <Tr key={category.id}>
              <Td>{category.name}</Td>
              <Td>
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Eliminar categoría"
                  colorScheme="red"
                  onClick={() => handleDeleteCategory(category.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}