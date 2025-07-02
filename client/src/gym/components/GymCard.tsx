import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { GymType } from '../entities';

const CourtCard = (gym: GymType) => {
  return (
    <div className="flex items-center border rounded-2xl overflow-hidden shadow-lg w-full max-w-5xl bg-white hover:shadow-xl transition-shadow p-4 mt-4 mb-4">
      <div className="flex-1 pr-6 text-sm space-y-4">
        <h2 className="font-semibold text-xl mb-2">{gym.name}</h2>

        <p>
          <span className="font-medium">Descripción:</span> {gym.description}
        </p>

        <div className="pt-4">
          <Link className="btn-card inline-flex items-center gap-1" to={`${name}`}>
            Horarios <RightOutlined />
          </Link>
        </div>
      </div>

      <div className="flex-shrink-0 w-2/3 max-w-[250px] aspect-square rounded-2xl overflow-hidden ml-4">
        <img
          className="w-full h-full object-cover object-center"
          src={gym.imageUrl ?? ''}
          alt={`Imagen de ${gym.name}`}
        />
      </div>
    </div>
  );
};

export default CourtCard;
