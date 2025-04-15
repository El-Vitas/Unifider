import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Acceso Denegado</h1>
        <p className="text-md text-gray-500 mb-6">Lo siento, no tienes permiso para acceder a esta página.</p>
        <button
          onClick={handleGoBack}
          className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
