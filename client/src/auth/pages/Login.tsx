import { useState } from 'react';
import { toast } from 'react-toastify';
import InputField from '../../common/components/form/InputField';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = () => {
    console.log('llamada al backend');
    toast.success('llamada al backend');
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
