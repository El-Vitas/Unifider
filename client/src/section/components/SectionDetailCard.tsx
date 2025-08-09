import defaultImg from '../../assets/img/defaultImg.png';
import config from '../../config';
import type { SectionTimeSlot } from '../entities';
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import BtnPrimary from '../../common/components/button/BtnPrimary';
import BtnDelete from '../../common/components/button/BtnDelete';

interface SectionDetailCardProps {
  number: number;
  imageUrl?: string;
  description?: string;
  instructor?: string;
  timeSlots?: SectionTimeSlot[];
  bookingsCount: number;
  isBooked?: boolean;
  capacity: number;
  showAdminButtons?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SectionDetailCard = ({
  number,
  imageUrl,
  description,
  instructor,
  timeSlots = [],
  bookingsCount,
  capacity,
  showAdminButtons = false,
  onEdit,
  onDelete,
}: SectionDetailCardProps) => {
  const getWeekDay = (day: number): string => {
    const weekDays = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    return weekDays[day] || 'Día no disponible';
  };

  const isCapacityFull = bookingsCount >= capacity;
  const availableSpots = capacity - bookingsCount;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-row min-h-[140px] w-full">
      <div className="relative min-w-[160px] w-40 h-auto flex-shrink-0 flex flex-col justify-center">
        <img
          src={imageUrl ? `${config.domain}${imageUrl}` : defaultImg}
          alt={instructor || 'Sección'}
          className="object-cover w-full h-full min-h-[140px] max-h-[180px]"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between p-4 gap-2">
        <div className="flex flex-row justify-between items-start gap-2">
          <div>
            <h3 className="text-lg font-bold mb-1">Sección {number}</h3>
            <div className="flex items-center gap-2 text-gray-700 text-xs mb-1">
              <UserOutlined className="text-xs" />
              <span>{instructor || 'Sin instructor asignado'}</span>
            </div>
            <div className="text-xs text-gray-500">ID: {number}</div>
            <div className="text-xs text-gray-500">
              Cupos: {bookingsCount}/{capacity}
            </div>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-bold shadow ${
              isCapacityFull
                ? 'bg-red-500 text-white'
                : availableSpots <= 5
                  ? 'bg-yellow-500 text-white'
                  : 'bg-green-500 text-white'
            }`}
          >
            {isCapacityFull ? 'Completo' : `${availableSpots} libres`}
          </div>
        </div>
        {description && (
          <div className="text-xs text-gray-700 line-clamp-2 mb-1">
            {description}
          </div>
        )}
        {timeSlots.length > 0 && (
          <div className="bg-gray-50 rounded p-2 mt-1">
            <div className="flex items-center gap-2 mb-1">
              <CalendarOutlined className="text-blue-600 text-xs" />
              <span className="font-semibold text-gray-900 text-xs">
                Horarios
              </span>
            </div>
            <div className="grid gap-1">
              {timeSlots.map((timeSlot, idx) => {
                const start = new Date(timeSlot.startTime).toLocaleTimeString(
                  [],
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                );
                const end = new Date(timeSlot.endTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const weekDayName = getWeekDay(timeSlot.dayOfWeek);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white rounded px-2 py-1 border border-gray-100"
                  >
                    <span className="font-medium text-gray-900 text-xs">
                      {weekDayName}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <ClockCircleOutlined className="text-xs" />
                      <span>
                        {start} - {end}
                      </span>
                    </div>
                    {timeSlot.location && (
                      <span className="text-xs text-gray-400">
                        📍 {timeSlot.location.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {showAdminButtons && (
          <div className="flex gap-2 mt-2">
            <BtnPrimary onClick={onEdit} className="!py-2 !text-xs">
              Editar
            </BtnPrimary>
            <BtnDelete
              onDelete={onDelete || (() => {})}
              className="!py-2 !text-xs"
            >
              Eliminar
            </BtnDelete>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionDetailCard;
