const EquipmentCard = ({ props }) => {
  const { name, imageUrl } = props;
  return (
    <div className="card w-64 border rounded-2xl">
      <div>
        <img
          className="rounded-t-2xl w-64 h-40 object-cover"
          src={imageUrl}
          alt=""
        />
      </div>
      <div className="px-4 py-4">
        <ul>
          <li>{name}</li>
        </ul>
      </div>
    </div>
  );
};

export default EquipmentCard;
