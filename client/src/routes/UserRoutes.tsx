import { Route, Routes } from 'react-router-dom';
import Gym from '../gym/pages/GymUser';
import BlockSelector from '../common/components/BlockSelector';
import GymEdit from '../gym/pages/GymEdit';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/gym" element={<Gym />} />
      <Route path="/gym/:gymName" element={<BlockSelector />} />
      <Route path="/gym/edit/:gymName" element={<GymEdit />} />
    </Routes>
  );
};

export default UserRoutes;
