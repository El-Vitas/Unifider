import { Route, Routes } from 'react-router-dom';
import Gym from '../gym/pages/GymUser';
import GymEquipment from '../gym/pages/GymEquipment';
import GymBooking from '../gym/pages/GymBooking';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/gym" element={<Gym />} />
      <Route path="/gym/equipment/:gymName" element={<GymEquipment />} />
      <Route path="/gym/booking/:gymId" element={<GymBooking />} />
    </Routes>
  );
};

export default UserRoutes;
