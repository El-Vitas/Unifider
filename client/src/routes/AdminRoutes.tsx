import { Route, Routes } from 'react-router-dom';
import GymAdmin from '../gym/pages/GymAdmin';
import Location from '../location/pages/Location';
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/create-gym" element={<GymAdmin/>} />
      {/* <Route path="/gym/:gymName" element={<BlockSelector />} /> */}
      <Route path="location" element={<Location/>} />
    </Routes>
  );
};

export default AdminRoutes;
