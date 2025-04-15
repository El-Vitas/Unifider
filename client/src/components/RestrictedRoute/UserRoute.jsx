import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const UserRoute = () => {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (role !== 'user') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default UserRoute;
