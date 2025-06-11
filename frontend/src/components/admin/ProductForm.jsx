import { useState, useEffect } from 'react';
import { 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, 
  ModalCloseButton, FormControl, FormLabel, Input, NumberInput, 
  NumberInputField, Select, Button, useToast, Textarea,
  Image, Box, Text, Flex
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { createProduct, updateProduct, getCategories, getProduct } from '../../services/api';

export default function ProductForm({ isOpen, onClose, product, onSuccess }) {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Cargar datos del producto cuando cambia el prop o se abre el modal
  useEffect(() => {
    const loadProductData = async () => {
      if (product && isOpen) {
        try {
          const response = await getProduct(product.id);
          setCurrentProduct(response.data);
          
          // Configurar vista previa de imagen si existe
          if (response.data.image) {
            setPreviewImage(response.data.image);
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'No se pudo cargar la información del producto',
            status: 'error'
          });
        }
      }
    };

    loadProductData();
  }, [product, isOpen, toast]);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las categorías',
          status: 'error'
        });
      }
    };
    
    if (isOpen) fetchCategories();
  }, [isOpen, toast]);

  const formik = useFormik({
    enableReinitialize: true, // Permite reinicializar con nuevos valores
    initialValues: {
      name: currentProduct?.name || '',
      price: currentProduct?.price || 0,
      stock: currentProduct?.stock || 1,
      category: currentProduct?.category?.id || '',
      description: currentProduct?.description || '',
      image: null
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', values.price);
        formData.append('stock', values.stock);
        formData.append('category_id', values.category);
        formData.append('description', values.description);
        
        if (values.image) {
          formData.append('image', values.image);
        } else if (currentProduct?.image && !values.image) {
          // Mantener la imagen existente si no se sube una nueva
          formData.append('image', currentProduct.image);
        }

        if (product) {
          await updateProduct(product.id, formData);
          toast({ title: 'Producto actualizado', status: 'success' });
        } else {
          await createProduct(formData);
          toast({ title: 'Producto creado', status: 'success' });
        }
        
        onSuccess();
        onClose();
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.detail || 'Error al guardar el producto',
          status: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product ? 'Editar Producto' : 'Nuevo Producto'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={formik.handleSubmit}>
            <Flex mb={4} gap={4}>
              <Box flex={1}>
                {previewImage && (
                  <Image 
                    src={typeof previewImage === 'string' ? previewImage : URL.createObjectURL(previewImage)}
                    alt="Vista previa" 
                    maxH="150px"
                    mb={2}
                    objectFit="contain"
                  />
                )}
                
                <FormControl mb={4}>
                  <FormLabel>Imagen del producto</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    p={1}
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {currentProduct?.image ? 'Imagen actual mantendrá si no se selecciona nueva' : 'Formatos: JPG, PNG, GIF (Max 2MB)'}
                  </Text>
                </FormControl>
              </Box>
              
              <Box flex={2}>
                <FormControl mb={4} isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                </FormControl>
              </Box>
            </Flex>
            
            <Flex gap={4} mb={4}>
              <FormControl isRequired>
                <FormLabel>Precio</FormLabel>
                <NumberInput 
                  precision={2} 
                  min={0}
                  value={formik.values.price}
                  onChange={(valueString) => formik.setFieldValue('price', parseFloat(valueString || 0))}
                >
                  <NumberInputField name="price" />
                </NumberInput>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Stock</FormLabel>
                <NumberInput 
                  min={0}
                  value={formik.values.stock}
                  onChange={(valueString) => formik.setFieldValue('stock', parseInt(valueString || 0))}
                >
                  <NumberInputField name="stock" />
                </NumberInput>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Categoría</FormLabel>
                <Select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  placeholder="Selecciona categoría"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
            
            <FormControl mb={4}>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                rows={3}
              />
            </FormControl>
            
            <Flex justify="flex-end" mt={6}>
              <Button 
                type="submit" 
                colorScheme="teal" 
                mr={3}
                isLoading={loading}
              >
                {product ? 'Actualizar Producto' : 'Crear Producto'}
              </Button>
              <Button onClick={onClose} isDisabled={loading}>
                Cancelar
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}