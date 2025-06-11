// main.jsx (asegúrate de que sea así)
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)