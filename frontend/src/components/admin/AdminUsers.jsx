import { useEffect, useState } from 'react';
import { 
  Table, Thead, Tbody, Tr, Th, Td, 
  Button, IconButton, Text, Spinner, 
  Alert, AlertIcon, Box
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { getUsers, deleteUser } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar usuarios");
        console.error("Error cargando usuarios:", err);
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario permanentemente?")) {
      try {
        setLoading(true);
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        setError("Error eliminando usuario");
        console.error("Error eliminando usuario:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" thickness="4px" speed="0.65s" />
        <Text mt={4}>Cargando lista de usuarios...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" mt={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box overflowX="auto">
      <Table variant="striped" colorScheme="gray" size="md">
        <Thead bg="teal.500">
          <Tr>
            <Th color="white">Email</Th>
            <Th color="white">Tipo</Th>
            <Th color="white">Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.length === 0 ? (
            <Tr>
              <Td colSpan={3} textAlign="center">
                <Text py={4} fontSize="lg">No hay usuarios registrados</Text>
              </Td>
            </Tr>
          ) : (
            users.map(user => (
              <Tr key={user.id}>
                <Td>{user.email}</Td>
                <Td>{user.user_type}</Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Editar usuario"
                    colorScheme="blue"
                    mr={2}
                    size="sm"
                    onClick={() => console.log("Editar usuario", user.id)}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Eliminar usuario"
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    isDisabled={user.user_type === 'admin'} // No permitir eliminar admins
                  />
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
}