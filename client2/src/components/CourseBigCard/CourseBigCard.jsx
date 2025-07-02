import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import defaultImg from '../../assets/img/defaultImg.png';

const CourseBigCard = ({
  number,
  imageUrl,
  description,
  instructor,
  timeSlots,
  bookingsCount,
  isBooked,
  capacity,
}) => {
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    setEnrolled(isBooked);
  }, [isBooked]);

  const handleEnroll = () => {
    if (!enrolled) {
      setEnrolled(true);
      toast('Inscripción realizada!');
    }
  };

  const getWeekDay = (day) => {
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

  return (
    <div className="flex gap-4 overflow-hidden">
      <div className="flex-1 border bg-white p-4 rounded-2xl flex flex-col justify-between">
        <ul className="space-y-4">
          <li>
            <span className="font-medium">Paralelo:</span> {number}
          </li>
          <li>
            <span className="font-medium">Profesor:</span> {instructor}
          </li>

          {timeSlots.map((timeSlot, idx) => {
            const start = new Date(timeSlot.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const end = new Date(timeSlot.endTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const weekDayName = getWeekDay(timeSlot.dayOfWeek);

            return (
              <li key={idx}>
                <div>
                  <span className="font-medium">Horario:</span> {weekDayName} {start} - {end}
                </div>
                <div>
                  <span className="font-medium">Lugar:</span>{' '}
                  {timeSlot.location?.name || 'No disponible'}
                </div>
              </li>
            );
          })}

          <li>
            <span className="font-medium">Capacidad:</span>{' '}
            <span
              className={
                bookingsCount >= capacity ? 'text-red-600 font-semibold' : ''
              }
            >
              {bookingsCount}/{capacity}
            </span>
          </li>
        </ul>

        <div className="mt-4">
          <button
            className={enrolled ? 'btn-disabled' : 'btn-card'}
            onClick={handleEnroll}
            disabled={enrolled}
          >
            {enrolled ? 'Inscrito' : 'Inscribirse'}
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <img
          className="w-96 h-64 rounded-2xl object-cover"
          src={imageUrl ?? defaultImg}
          alt={description}
        />
      </div>
    </div>
  );
};

CourseBigCard.propTypes = {
  number: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  description: PropTypes.string.isRequired,
  instructor: PropTypes.string.isRequired,
  timeSlots: PropTypes.arrayOf(
    PropTypes.shape({
      dayOfWeek: PropTypes.number,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
      location: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
      }),
    })
  ).isRequired,
  bookingsCount: PropTypes.number.isRequired,
  isBooked: PropTypes.bool.isRequired,
  capacity: PropTypes.number.isRequired,
};

export default CourseBigCard;
