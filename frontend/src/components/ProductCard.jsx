// src/components/ProductCard.jsx
import { Card, CardBody, Image, Stack, Heading, Text, Button } from '@chakra-ui/react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <Card>
      <Image 
        src={product.image || "https://via.placeholder.com/300"} 
        alt={product.name}
        height="200px"
        objectFit="cover"
      />
      <CardBody>
        <Heading size="md">{product.name}</Heading>
        <Text py="2">${product.price}</Text>
        <Button 
          colorScheme="teal" 
          width="full"
          onClick={onAddToCart}
        >
          Agregar al carrito
        </Button>
      </CardBody>
    </Card>
  );
}