import { useEffect, useState } from 'react';
import { 
  Table, Thead, Tbody, Tr, Th, Td, 
  Button, IconButton, Text 
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { getProducts, deleteProduct } from '../../services/api';
import ProductForm from './ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div>
      <Button 
        leftIcon={<AddIcon />} 
        colorScheme="teal" 
        mb={4}
        onClick={() => {
          setSelectedProduct(null);
          setIsFormOpen(true);
        }}
      >
        Nuevo Producto
      </Button>

      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Precio</Th>
            <Th>Stock</Th>
            <Th>Categoría</Th> {/* Nueva columna añadida */}
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map(product => (
            <Tr key={product.id}>
              <Td>{product.name}</Td>
              <Td>${product.price}</Td>
              <Td>{product.stock}</Td>
              <Td>
                {product.category ? (
                  <Text>{product.category.name}</Text>
                ) : (
                  <Text color="gray.500">Sin categoría</Text>
                )}
              </Td>
              <Td>
                <IconButton
                  icon={<EditIcon />}
                  aria-label="Editar"
                  mr={2}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsFormOpen(true);
                  }}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Eliminar"
                  colorScheme="red"
                  onClick={() => handleDelete(product.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={selectedProduct}
        onSuccess={loadProducts}
      />
    </div>
  );
}