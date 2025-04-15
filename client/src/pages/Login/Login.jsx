import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../../config';
import { useAuth } from '../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.apiUrl}/v1/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;
      if (!token) {
        throw new Error('Token not received');
      }
      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (!role) {
        throw new Error('Role not received');
      }

      login(token, role);
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error('Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Correo electrónico */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ejemplo@dominio.com"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contraseña"
            />
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Enlace para registrarse */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
