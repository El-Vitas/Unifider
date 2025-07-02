import EquipmentCard from '../../components/GymCard/EquipmentCard';
import equipment from '../../data/equipment.json';

const Equipment = () => {
  console.log('Equipment', equipment);
  return (
    <div className="container-cards px-4 mt-6 flex flex-row space-x-12">
      {equipment.map((equipment) => (
        <EquipmentCard props={equipment} />
      ))}
    </div>
  );
};

export default Equipment;
