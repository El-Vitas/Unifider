import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const GymCard = ({ props }) => {
  const { name, startTime, endTime, imageUrl } = props;
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
        <h2 className="font-medium text-lg">{name}</h2>
        <ul>
          <li>
            {startTime} : {endTime}
          </li>
        </ul>
        <div className="pt-4">
          <Link className="btn-card" to={`Horarios ${name}`}>
            Horarios
            <RightOutlined />
          </Link>
        </div>
        <div className="pt-4">
          <Link className="btn-card" to={'Equipamiento'}>
            Maquinas
            <RightOutlined />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GymCard;
