import SelectionCard from '../../components/SelectionCard/SelectionCard';
import selections from '../../data/selections.json';
const Selections = () => {
  return (
    <div className="container-cards px-4 mt-6 flex flex-row space-x-12">
      {selections.map((selection) => (
        <SelectionCard key={selection.name} props={selection} />
      ))}
    </div>
  );
};

export default Selections;
