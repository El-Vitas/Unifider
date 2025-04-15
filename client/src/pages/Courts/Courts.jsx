import CourtCard from '../../components/CourtCard/CourtCard';
import courts from '../../data/courts.json';

const Courts = () => {
  console.log('Courts', courts);
  return (
    <div className="container-cards px-4 mt-6 flex flex-row space-x-12">
      {courts.map((court) => (
        <CourtCard key={court.id} props={court} />
      ))}
    </div>
  );
};

export default Courts;
