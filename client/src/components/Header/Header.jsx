import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { GrLogout } from 'react-icons/gr';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useAuth();

  const dropdownRef = useRef();
  const routes = {
    talleres: role === 'admin' ? 'crear-taller' : 'talleres',
    selecciones: role === 'admin' ? 'crear-seleccion' : 'selecciones',
    gimnasio: role === 'admin' ? 'crear-gimnasio' : 'gimnasio',
    canchas: role === 'admin' ? 'crear-cancha' : 'canchas',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="Header flex flex-row justify-between items-center">
      {/* Navegación principal */}
      <div className="flex flex-1 justify-evenly">
        <Link
          className="btn-header font-medium text-white"
          to={routes.talleres}
        >
          {role === 'admin' ? 'Crear Taller' : 'Talleres'}
        </Link>
        <Link
          className="btn-header font-medium text-white"
          to={routes.selecciones}
        >
          {role === 'admin' ? 'Crear Selección' : 'Selecciones'}
        </Link>
        <Link
          className="btn-header font-medium text-white"
          to={routes.gimnasio}
        >
          {role === 'admin' ? 'Crear Gimnasio' : 'Gimnasio'}
        </Link>
        <Link className="btn-header font-medium text-white" to={routes.canchas}>
          {role === 'admin' ? 'Crear Cancha' : 'Canchas'}
        </Link>
      </div>

      <div className="relative ml-8" ref={dropdownRef}>
        <button
          className="btn-menu font-medium text-white flex items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Usuario</span>
          <FiChevronDown className="text-white" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#0d73ab] text-white border border-white/20 rounded shadow-md z-50">
            <Link
              to="/perfil"
              className="flex px-4 py-2 hover:bg-[#0b669a] transition justify-start items-center gap-2"
            >
              <FaUserCircle className="text-white text-xl" />
              Perfil
            </Link>
            <Link
              to="/logout"
              className="flex px-4 py-2 hover:bg-[#0b669a] transition justify-start items-center gap-2"
            >
              <GrLogout className="text-white text-xl" />
              Cerrar sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
