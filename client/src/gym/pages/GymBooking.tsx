import { useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customToast } from '../../common/utils/customToast';
import { httpAdapter } from '../../common/adapters/httpAdapter';
import { useAsync } from '../../common/hooks/useAsync';
import config from '../../config';
import { useAuth } from '../../common/hooks/useAuth';
import type { CustomHttpResponse } from '../../common/types';
import BookingCalendar from '../../common/components/booking/BookingCalendar';
import ContainerCards from '../../common/components/ContainerCards';

interface TimeBlock {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  isEnabled: boolean;
  currentBookings: number;
  isUserBooked: boolean;
}

interface GymSchedule {
  gymName: string;
  timeBlocks: TimeBlock[];
}

const GymBooking = () => {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  const authToken = useAuth().authToken;

  const url = useMemo(() => `${config.apiUrl}/gym/${gymId}/schedule`, [gymId]);

  const fetchScheduleFn = useCallback(
    () =>
      httpAdapter.get<GymSchedule>(url, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      }),
    [url, authToken],
  );

  const {
    data,
    loading,
    error,
    execute: fetchSchedule,
  } = useAsync<CustomHttpResponse<GymSchedule>>(
    fetchScheduleFn,
    'Failed to fetch gym schedule',
  );

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const scheduleData = data?.data;

  useEffect(() => {
    if (error) {
      customToast.error(error);
    }
  }, [error]);

  const handleReserve = async (
    bookings: Array<{ scheduleTimeBlockId: string; bookingDate: string }>,
  ) => {
    try {
      await httpAdapter.post(
        `${config.apiUrl}/gym/booking/multiple`,
        { bookings },
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        },
      );

      customToast.success('¡Reservas realizadas exitosamente!');

      await fetchSchedule();

      setTimeout(() => {
        navigate('/gym');
      }, 2000);
    } catch (error) {
      console.error('Error creating bookings:', error);
      customToast.error('Error al realizar las reservas');
      throw error;
    }
  };

  const handleUnsubscribe = async (timeBlockId: string) => {
    try {
      await httpAdapter.delete(
        `${config.apiUrl}/gym/${gymId}/timeblock/${timeBlockId}/booking`,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        },
      );

      customToast.success('Reserva cancelada exitosamente');

      await fetchSchedule();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      customToast.error('Error al cancelar la reserva');
      throw error;
    }
  };

  if (loading) {
    return <div className="mt-6 text-center">Cargando horarios...</div>;
  }

  if (!scheduleData) {
    return (
      <div className="mt-6 text-center">
        No se encontraron horarios para este gimnasio.
      </div>
    );
  }

  return (
    <ContainerCards>
      <BookingCalendar
        timeBlocks={scheduleData.timeBlocks}
        entityName={scheduleData.gymName}
        onReserve={handleReserve}
        onUnsubscribe={handleUnsubscribe}
      />
    </ContainerCards>
  );
};

export default GymBooking;
