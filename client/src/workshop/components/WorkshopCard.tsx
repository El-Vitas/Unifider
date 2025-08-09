import { Link } from 'react-router-dom';
import defaultImg from '../../assets/img/defaultImg.png';
import { capitalize } from '../../common/utils/capitalize';
import type { ReactNode } from 'react';
import config from '../../config';

type WorkshopCardProps = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  sectionsCount: number;
  buttons?: ReactNode;
  linkTo?: string;
};

const WorkshopCard = ({
  name,
  description,
  imageUrl,
  sectionsCount,
  buttons,
  linkTo,
}: WorkshopCardProps) => {
  const CardContent = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={imageUrl ? `${config.domain}${imageUrl}` : defaultImg}
          alt={name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-xs font-medium">Taller Educativo</span>
            </div>

            <div className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              {sectionsCount} {sectionsCount === 1 ? 'sección' : 'secciones'}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2 drop-shadow-lg">
              {capitalize(name)}
            </h3>
            <p className="text-sm text-white/90 line-clamp-2 drop-shadow">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Activo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Inscripciones abiertas</span>
            </div>
          </div>
        </div>

        {buttons && (
          <div className="border-t border-gray-100 pt-4">{buttons}</div>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default WorkshopCard;
