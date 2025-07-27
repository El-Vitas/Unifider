import { Route, Routes } from 'react-router-dom';
import Logout from '../auth/pages/Logout';

const CommonRoutes = () => {
  return (
    <Routes>
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

export default CommonRoutes;
