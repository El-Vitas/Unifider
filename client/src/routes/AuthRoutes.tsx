import { Route, Routes } from 'react-router-dom';
import Login from '../auth/pages/Login';
import Register from '../auth/pages/Register';
const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AuthRoutes;
