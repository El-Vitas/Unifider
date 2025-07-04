import { Route, Routes } from 'react-router-dom';
import Login from '../auth/pages/Login';
import Register from '../auth/pages/Register';
import Gym from '../gym/pages/Gym';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/gyms" element={<Gym />} />
    </Routes>
  );
};

export default UserRoutes;
