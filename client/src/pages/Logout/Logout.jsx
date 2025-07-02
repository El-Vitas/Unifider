import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      return;
    }
    logout();
    localStorage.removeItem('authToken');

    toast.success('Has cerrado sesión exitosamente');
    navigate('/login');
  }, [navigate, logout]);
  return null;
};

export default Logout;
