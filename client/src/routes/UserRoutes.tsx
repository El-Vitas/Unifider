import { Route, Routes } from 'react-router-dom';
import Gym from '../gym/pages/GymUser';
import Court from '../court/pages/CourtUser';
import GymEquipment from '../gym/pages/GymEquipment';
import GymBooking from '../gym/pages/GymBooking';
import CourtBooking from '../court/pages/CourtBooking';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/gym" element={<Gym />} />
      <Route path="/gym/equipment/:gymName" element={<GymEquipment />} />
      <Route path="/gym/booking/:gymId" element={<GymBooking />} />

      <Route path="/court" element={<Court />} />
      <Route path="/court/booking/:courtId" element={<CourtBooking />} />
    </Routes>
  );
};

export default UserRoutes;
