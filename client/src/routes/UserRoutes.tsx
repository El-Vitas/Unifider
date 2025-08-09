import { Route, Routes } from 'react-router-dom';
import Gym from '../gym/pages/GymUser';
import Court from '../court/pages/CourtUser';
import GymEquipment from '../gym/pages/GymEquipment';
import GymBooking from '../gym/pages/GymBooking';
import CourtBooking from '../court/pages/CourtBooking';
import TeamUser from '../team/pages/TeamUser';
import WorkshopUser from '../workshop/pages/WorkshopUser';
import WorkshopDetail from '../workshop/pages/WorkshopDetail';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/gym" element={<Gym />} />
      <Route path="/gym/equipment/:gymName" element={<GymEquipment />} />
      <Route path="/gym/booking/:gymId" element={<GymBooking />} />

      <Route path="/court" element={<Court />} />
      <Route path="/court/booking/:courtId" element={<CourtBooking />} />

      <Route path="/team" element={<TeamUser />} />

      <Route path="/workshop" element={<WorkshopUser />} />
      <Route path="/workshop/:id" element={<WorkshopDetail />} />
    </Routes>
  );
};

export default UserRoutes;
