import GymCard from '../../components/GymCard/GymCard';
import gym from '../../data/gym.json';

const Gym = () => {
  console.log('Gym', gym);
  return (
    <div className="container-cards px-4 mt-6 flex flex-row space-x-12">
      {gym.map((gym) => (
        <GymCard props={gym} />
      ))}
    </div>
  );
};

export default Gym;
