import { Link } from 'react-router-dom';
import { Button, Flex, Spacer } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
  
    return (
      <Flex p={4} bg="teal.500" color="white">
        <Link to="/">Inicio</Link>
        <Spacer />
        {user ? (
          <>
          {user.userType === 'admin' && (
            <Link to="/admin">
              <Button variant="ghost" _hover={{ bg: 'teal.600' }} mr={2}>
                Panel Admin
              </Button>
            </Link>
          )}
          <Link to="/shop">
            <Button variant="ghost" _hover={{ bg: 'teal.600' }} mr={2}>
              Tienda
            </Button>
          </Link>
          <Button 
            onClick={logout}
            variant="outline"
            _hover={{ bg: 'teal.600' }}
          >
            Cerrar Sesión
          </Button>
        </>
        ) : (
          <>
          <Link to="/login">
            <Button variant="ghost" _hover={{ bg: 'teal.600' }} mr={2}>
              Iniciar Sesión
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" _hover={{ bg: 'teal.600' }}>
              Registrarse
            </Button>
          </Link>
        </>
      )}
    </Flex>
  );
}