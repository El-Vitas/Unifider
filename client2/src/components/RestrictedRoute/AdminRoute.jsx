import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const role = localStorage.getItem('role');

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;
