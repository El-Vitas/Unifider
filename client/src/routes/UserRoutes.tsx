import { Route, Routes } from 'react-router-dom';
import Gym from '../gym/pages/GymUser';
import BlockSelector from '../common/components/BlockSelector';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/gym" element={<Gym />} />
      <Route path="/gym/:gymName" element={<BlockSelector />} />
    </Routes>
  );
};

export default UserRoutes;
