import { useState } from 'react';
import InputField from '../../common/components/form/InputField';
import config from '../../config';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import type { LoginResponse } from '../types';
import { customToast } from '../../common/utils/customToast';
import { isHttpErrorResponse } from '../../common/utils/typeGuards';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../common/hooks/useAuth';
import type { DecodedToken } from '../../common/types';
import { useNavigate } from 'react-router-dom';
import type { CustomHttpResponse } from '../../common/types';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const auth = useAuth();
  const navigate = useNavigate();
  const handleSuccessfulLogin = (
    response: CustomHttpResponse<LoginResponse>,
  ) => {
    customToast.success('Inicio de sesión exitoso');
    const token = response.data.token;

    if (!token) {
      throw new Error('Token no recibido en la respuesta del servidor.');
    }

    const decoded: DecodedToken = jwtDecode(token);
    const role = decoded.role;

    if (!role) {
      throw new Error('Rol no encontrado en el token.');
    }

    auth.login(token, role);
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        customToast.error('Email y contraseña son obligatorios');
        return;
      }

      const response = await httpAdapter.post<LoginResponse>(
        `${config.apiUrl}/auth/login`,
        { email, password },
      );
      console.log('Login response:', response);

      if (response.status === 201) {
        handleSuccessfulLogin(response);
      } else {
        customToast.error('Inicio de sesión fallido: Respuesta inesperada.');
      }
    } catch (error) {
      if (isHttpErrorResponse(error)) {
        if (error.response?.status === 401) {
          customToast.error(
            'Correo o contraseña inválidos. Por favor, intenta de nuevo.',
          );
        } else if (error.response?.status === 500) {
          customToast.error(
            'Error del servidor. Por favor, inténtalo más tarde.',
          );
        }
      } else {
        customToast.error('Fallo en el inicio de sesión: Error desconocido');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit}>
          <InputField
            id="email"
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@domain.com"
            required={true}
          />

          <InputField
            id="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required={true}
          />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Iniciar sesión
          </button>
        </form>

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
