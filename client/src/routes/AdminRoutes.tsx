import { Route, Routes } from 'react-router-dom';
import GymAdmin from '../gym/pages/GymAdmin';
import Location from '../location/pages/Location';
import LocationEdit from '../location/pages/LocationEdit';
import GymEdit from '../gym/pages/GymEdit';
import LocationCreate from '../location/pages/LocationCreate';
import EquipmentAdmin from '../equipment/pages/EquipmentAdmin';
import EquipmentCreate from '../equipment/pages/EquipmentCreate';
import EquipmentEdit from '../equipment/pages/EquipmentEdit';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/gym" element={<GymAdmin />} />
      <Route path="/gym/edit/:gymName" element={<GymEdit />} />
      <Route path="/gym/equipment" element={<EquipmentAdmin />} />
      <Route path="/gym/equipment/create" element={<EquipmentCreate />} />
      <Route
        path="/gym/equipment/edit/:equipmentName"
        element={<EquipmentEdit />}
      />

      <Route path="/location" element={<Location />} />
      <Route path="/location/edit/:locationName" element={<LocationEdit />} />
      <Route path="/location/create" element={<LocationCreate />} />
    </Routes>
  );
};

export default AdminRoutes;
