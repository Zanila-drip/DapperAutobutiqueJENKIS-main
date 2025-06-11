// frontend/src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, VStack } from '@chakra-ui/react';
import { registerUser } from '../services/api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ username, email, password, phone, address });
            navigate('/login');
        } catch (error) {
            console.error('Error al registrar:', error);
        }
    };

    return (
        <Box p={4}>
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                <Input
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    placeholder="Correo electrónico"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                    placeholder="Teléfono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                    placeholder="Dirección"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <Button type="submit">Registrarse</Button>
            </VStack>
        </Box>
    );
}