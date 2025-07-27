import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../common/hooks/useAuth';

const Logout = () => {
  const navigate = useNavigate();
  const auth = useAuth(); 

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      return;
    }
    auth?.logout();
    localStorage.removeItem('authToken');

    toast.success('Has cerrado sesión exitosamente');
    navigate('/login');
  }, [navigate, auth]);
  return null;
};

export default Logout;