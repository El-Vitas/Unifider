import { Route, Routes } from 'react-router-dom';
import GymAdmin from '../gym/pages/GymAdmin';
import Location from '../location/pages/Location';
import LocationEdit from '../location/pages/LocationEdit';
import GymEdit from '../gym/pages/GymEdit';
import LocationCreate from '../location/pages/LocationCreate';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/gym" element={<GymAdmin/>} />
      <Route path="/gym/edit/:gymName" element={<GymEdit />} />

      <Route path="/location" element={<Location/>} />
      <Route path="/location/edit/:locationName" element={<LocationEdit/>} />
      <Route path="location/create" element={<LocationCreate />} />
      
    </Routes>
  );
};

export default AdminRoutes;
