import { Route, Routes } from 'react-router-dom';
import GymAdmin from '../gym/pages/GymAdmin';
import CourtAdmin from '../court/pages/CourtAdmin';
import Location from '../location/pages/Location';
import LocationEdit from '../location/pages/LocationEdit';
import GymEdit from '../gym/pages/GymEdit';
import CourtEdit from '../court/pages/CourtEdit';
import LocationCreate from '../location/pages/LocationCreate';
import EquipmentAdmin from '../equipment/pages/EquipmentAdmin';
import EquipmentCreate from '../equipment/pages/EquipmentCreate';
import EquipmentEdit from '../equipment/pages/EquipmentEdit';
import GymCreate from '../gym/pages/GymCreate';
import CourtCreate from '../court/pages/CourtCreate';
import GymBookings from '../gym/pages/GymBookings';
import CourtBookings from '../court/pages/CourtBookings';
import GymEquipment from '../gym/pages/GymEquipment';
import TeamAdmin from '../team/pages/TeamAdmin';
import TeamCreate from '../team/pages/TeamCreate';
import TeamEdit from '../team/pages/TeamEdit';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/gym" element={<GymAdmin />} />
      <Route path="/gym/edit/:gymName" element={<GymEdit />} />
      <Route path="/gym/create" element={<GymCreate />} />
      <Route path="/gym/bookings/:gymId" element={<GymBookings />} />
      <Route path="/gym/equipment/:gymName" element={<GymEquipment />} />
      <Route path="/gym/equipment" element={<EquipmentAdmin />} />
      <Route path="/gym/equipment/create" element={<EquipmentCreate />} />
      <Route
        path="/gym/equipment/edit/:equipmentName"
        element={<EquipmentEdit />}
      />

      <Route path="/court" element={<CourtAdmin />} />
      <Route path="/court/edit/:courtName" element={<CourtEdit />} />
      <Route path="/court/create" element={<CourtCreate />} />
      <Route path="/court/bookings/:courtId" element={<CourtBookings />} />

      <Route path="/location" element={<Location />} />
      <Route path="/location/edit/:locationName" element={<LocationEdit />} />
      <Route path="/location/create" element={<LocationCreate />} />

      <Route path="/team" element={<TeamAdmin />} />
      <Route path="/team/create" element={<TeamCreate />} />
      <Route path="/team/edit/:id" element={<TeamEdit />} />
    </Routes>
  );
};

export default AdminRoutes;
