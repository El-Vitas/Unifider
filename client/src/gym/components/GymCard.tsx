import type { GymType } from '../entities';
import defaultImg from '../../assets/img/defaultImg.png';
import { capitalize } from '../../common/utils/capitalize';
import type { ReactNode } from 'react';
import config from '../../config';

type GymCardProps = GymType & {
  buttons?: ReactNode;
};

const GymCard = ({
  name,
  description,
  location,
  imageUrl,
  buttons,
}: GymCardProps) => {
  return (
    <div
      className="group bg-white rounded-xl mb-4 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary/30 w-full max-w-none min-w-0"
      style={{ flexBasis: 'calc(50% - 12px)', maxWidth: 'calc(50% - 12px)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
        {/* Content Section */}
        <div className="space-y-2.5">
          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-200 line-clamp-1">
              {capitalize(name)}
            </h2>
            <div className="h-0.5 w-10 bg-primary rounded-full" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Descripción
            </p>
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          {/* Location Info */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5">
              <div className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Ubicación
              </p>
            </div>
            <div className="pl-3 space-y-0.5">
              <p className="text-gray-800 font-medium text-sm">
                {capitalize(location.name)}
              </p>
              <p className="text-gray-600 text-sm line-clamp-1">
                {capitalize(location.description)}
              </p>
            </div>
          </div>
        </div>

        {/* Image and Actions Section */}
        <div className="flex flex-col justify-between space-y-2.5 min-h-0">
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-lg bg-gray-50 aspect-[4/3]">
            <img
              className="object-contain object-center w-full h-full transition-transform duration-300 group-hover:scale-105 p-1"
              src={imageUrl ? `${config.domain}${imageUrl}` : defaultImg}
              alt={`Imagen de ${name}`}
            />
            {/* Image overlay */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Action Buttons */}
          {buttons && (
            <div className="flex flex-wrap justify-end gap-1.5 min-h-[2.5rem]">
              {buttons}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymCard;
