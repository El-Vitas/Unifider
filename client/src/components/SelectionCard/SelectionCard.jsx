const SelectionCard = ({ props }) => {
  const { name, instructor, contact, image } = props;
  return (
    <div className="card w-64 border rounded-2xl">
      <div>
        <img
          className="rounded-t-2xl w-64 h-40 object-cover"
          src={image}
          alt=""
        />
      </div>
      <div className="px-4 py-4">
        <h2 className="font-medium text-lg">Seleccion de {name}</h2>
        <ul>
          <li>Instructor: {instructor}</li>
          <li>Contacto: {contact}</li>
        </ul>
      </div>
    </div>
  );
};

export default SelectionCard;
