import { useState } from 'react';
import { 
  Tabs, TabList, Tab, TabPanels, TabPanel, 
  Box, Button, Heading, Text 
} from '@chakra-ui/react';
import AdminProducts from '../components/admin/AdminProducts';
import AdminUsers from '../components/admin/AdminUsers';
import AdminCategories from '../components/admin/AdminCategories';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { name: 'Productos', component: <AdminProducts /> },
    { name: 'Categorías', component: <AdminCategories /> },
    { name: 'Usuarios', component: <AdminUsers /> }
  ];

  return (
    <Box p={4}>
      <Heading mb={6} textAlign="center" size="xl" color="teal.600">
        Panel de Administración
      </Heading>
      
      <Tabs 
        index={activeTab} 
        onChange={setActiveTab}
        variant="soft-rounded"
        colorScheme="teal"
        isLazy
      >
        <TabList justifyContent="center" mb={6}>
          {tabs.map((tab, index) => (
            <Tab 
              key={index}
              mx={2}
              _selected={{ 
                color: 'white', 
                bg: 'teal.500',
                boxShadow: 'md'
              }}
            >
              {tab.name}
            </Tab>
          ))}
        </TabList>
        
        <TabPanels>
          {tabs.map((tab, index) => (
            <TabPanel key={index} p={4} borderWidth="1px" borderRadius="lg">
              {tab.component}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      
      <Box mt={6} textAlign="center">
        <Text fontSize="sm" color="gray.500" mb={4}>
          Cambiar sección rápidamente:
        </Text>
        <Button 
          colorScheme="blue" 
          onClick={() => setActiveTab(0)}
          mr={2}
          size="sm"
        >
          Productos
        </Button>
        <Button 
          colorScheme="green" 
          onClick={() => setActiveTab(1)}
          mr={2}
          size="sm"
        >
          Categorías
        </Button>
        <Button 
          colorScheme="orange" 
          onClick={() => setActiveTab(2)}
          size="sm"
        >
          Usuarios
        </Button>
      </Box>
    </Box>
  );
}