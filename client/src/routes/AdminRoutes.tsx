import { Route, Routes } from 'react-router-dom';
import GymAdmin from '../gym/pages/GymAdmin';
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/create-gym" element={<GymAdmin/>} />
      {/* <Route path="/gym/:gymName" element={<BlockSelector />} /> */}
    </Routes>
  );
};

export default AdminRoutes;
