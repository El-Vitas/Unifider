import type { GymType } from '../entities';
import defaultImg from '../../assets/img/defaultImg.png';
import { capitalize } from '../../common/utils/capitalize';
import type { ReactNode } from 'react';

type GymCardProps = GymType & {
  buttons?: ReactNode;
};

const GymCard = ({
  name,
  description,
  location,
  imageUrl,
  scheduleByDay,
  buttons,
}: GymCardProps) => {
  return (
    <div className="grid w-full grid-cols-2 p-4 mt-4 mb-4 overflow-hidden transition-shadow shadow-lg ring-1 ring-slate-900/10 rounded-2xl hover:shadow-xl">
      <div className="flex-1 pr-6 space-y-4 text-sm">
        <h2 className="mb-2 text-xl font-semibold">{capitalize(name)}</h2>
        <p>
          <span className="font-medium">Descripción:</span> {description}
        </p>

        {scheduleByDay && Object.keys(scheduleByDay).length > 0 && (
          <div>
            <p className="mb-1 font-medium">Horarios:</p>
            <ul className="space-y-1 list-disc list-inside">
              {Object.entries(scheduleByDay).map(([day, hours]) => (
                <li key={day}>
                  <span className="font-semibold">{day}:</span>{' '}
                  {hours.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p>
            <span className="font-medium">Ubicación:</span>{' '}
            {capitalize(location.name)}
          </p>
          <p>
            <span className="font-medium">Descripción de la Ubicación:</span>{' '}
            {capitalize(location.description)}
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="self-end flex-shrink-0 w-2/3 max-w-[250px] aspect-square rounded-2xl overflow-hidden ml-4">
          <img
            className="object-cover object-center w-full h-full"
            src={imageUrl ?? defaultImg}
            alt={`Imagen de ${name}`}
          />
        </div>

        <div className="flex justify-end gap-2">{buttons}</div>
      </div>
    </div>
  );
};

export default GymCard;
