import type { Team } from '../entities';
import defaultImg from '../../assets/img/defaultImg.png';
import config from '../../config';

type TeamCardProps = Team & {
  buttons?: React.ReactNode;
};

const TeamCard = ({
  name,
  instructor,
  contact,
  imageUrl,
  buttons,
}: TeamCardProps) => {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-300 w-72 mb-6">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl ? `${config.domain}${imageUrl}` : defaultImg}
          alt={`Imagen de ${name}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-700 mb-2 line-clamp-1">
            {name}
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Instructor:</span>{' '}
              {instructor || 'No asignado'}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Contacto:</span>{' '}
              {contact || 'No disponible'}
            </p>
          </div>
        </div>

        {buttons && (
          <div className="flex gap-2 pt-4 border-t border-gray-100 justify-center">
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
