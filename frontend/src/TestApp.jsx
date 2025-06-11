// src/TestApp.jsx
import { ChakraProvider, Text } from '@chakra-ui/react'

export default function TestApp() {
  return (
    <ChakraProvider>
      <Text fontSize="2xl" color="blue.500">¡Funciona!</Text>
    </ChakraProvider>
  )
}