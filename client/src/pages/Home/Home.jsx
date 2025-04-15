import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Home = () => {
  const { role } = useAuth();

  const routes = {
    talleres: role === 'admin' ? 'crear-taller' : 'talleres',
    selecciones: role === 'admin' ? 'crear-seleccion' : 'selecciones',
    gimnasio: role === 'admin' ? 'crear-gimnasio' : 'gimnasio',
    canchas: role === 'admin' ? 'crear-cancha' : 'canchas',
  };

  return (
    <div className="flex-row items-center justify-center space-y-32 mt-12">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center space-y-32">
          <div className="w-full max-w-6xl space-y-12">
            <img
              className="rounded-xl w-full"
              src="https://watermanagement.usm.cl/wp-content/uploads/2017/12/libro-80.w2000.jpg"
              alt=""
            />
            <span className="block text-center font-medium">
              Sitio web del departamento de Educación física, deportes y
              recreación
            </span>
          </div>
        </div>
      </div>

      <div className={`flex flex-row justify-between px-28 m-auto ${role === 'admin' ? 'space-x-26': 'space-x-32'} text-3xl`}>
        <Link className="btn-card" to={routes.talleres}>
          {role === 'admin' ? 'Crear Taller' : 'Talleres'}
        </Link>
        <Link className="btn-card" to={routes.selecciones}>
          {role === 'admin' ? 'Crear Selección' : 'Selecciones'}
        </Link>
        <Link className="btn-card" to={routes.gimnasio}>
          {role === 'admin' ? 'Crear Gimnasio' : 'Gimnasio'}
        </Link>
        <Link className="btn-card" to={routes.canchas}>
          {role === 'admin' ? 'Crear Cancha' : 'Canchas'}
        </Link>
      </div>
    </div>
  );
};

export default Home;
