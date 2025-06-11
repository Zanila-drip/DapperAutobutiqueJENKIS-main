// src/pages/Shop.jsx
import React, { useEffect, useState } from 'react';
import { 
  SimpleGrid, Heading, Button, Box, Text, 
  Input, InputGroup, InputLeftElement, Flex, 
  Spinner, Select
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar productos y categorías simultáneamente
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
        
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("No se pudieron cargar los productos. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filtrar productos basados en búsqueda y categoría
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || (product.category && product.category.id == selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6} flexWrap="wrap">
        <Heading as="h1" size="lg" mb={4}>Catálogo de Productos</Heading>
        
        <Flex mt={[4, 0]} width={["100%", "auto"]} flexWrap="wrap">
          <InputGroup mr={2} width={["100%", "300px"]} mb={2}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Select
            placeholder="Todas las categorías"
            width={["100%", "200px"]}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Flex>
      </Flex>

      <Button 
        colorScheme="teal" 
        mb={6}
        onClick={() => setIsCartOpen(true)}
      >
        Ver Carrito ({cartItems.length})
      </Button>

      {error ? (
        <Box bg="red.100" p={4} borderRadius="md" mb={4}>
          <Text color="red.600">{error}</Text>
        </Box>
      ) : null}

      {loading ? (
        <Box textAlign="center" py={10}>
          <Spinner size="xl" />
          <Text mt={4}>Cargando productos...</Text>
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Text fontSize="xl" textAlign="center" py={10}>
          No se encontraron productos
        </Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </SimpleGrid>
      )}

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
      />
    </Box>
  );
}