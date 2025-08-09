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
import WorkshopAdmin from '../workshop/pages/WorkshopAdmin';
import WorkshopCreate from '../workshop/pages/WorkshopCreate';
import WorkshopEdit from '../workshop/pages/WorkshopEdit';
import SectionAdmin from '../section/pages/SectionAdmin';
import SectionCreate from '../section/pages/SectionCreate';
import SectionEdit from '../section/pages/SectionEdit';

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

      <Route path="/workshop" element={<WorkshopAdmin />} />
      <Route path="/workshop/create" element={<WorkshopCreate />} />
      <Route path="/workshop/edit/:workshopId" element={<WorkshopEdit />} />
      <Route path="/workshop/sections/:workshopId" element={<SectionAdmin />} />

      <Route path="/section/create/:workshopId" element={<SectionCreate />} />
      <Route
        path="/section/edit/:sectionId/:workshopId"
        element={<SectionEdit />}
      />
    </Routes>
  );
};

export default AdminRoutes;
