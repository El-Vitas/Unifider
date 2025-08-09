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

interface CourtSchedule {
  courtName: string;
  timeBlocks: TimeBlock[];
}

const CourtBooking = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const navigate = useNavigate();
  const authToken = useAuth().authToken;

  const url = useMemo(
    () => `${config.apiUrl}/court/${courtId}/schedule`,
    [courtId],
  );

  const fetchScheduleFn = useCallback(
    () =>
      httpAdapter.get<CourtSchedule>(url, {
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
  } = useAsync<CustomHttpResponse<CourtSchedule>>(
    fetchScheduleFn,
    'Failed to fetch court schedule',
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
        `${config.apiUrl}/court/booking/multiple`,
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
        navigate('/court');
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
        `${config.apiUrl}/court/${courtId}/timeblock/${timeBlockId}/booking`,
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
        No se encontraron horarios para esta cancha.
      </div>
    );
  }

  return (
    <ContainerCards>
      <BookingCalendar
        timeBlocks={scheduleData.timeBlocks}
        entityName={scheduleData.courtName}
        onReserve={handleReserve}
        onUnsubscribe={handleUnsubscribe}
      />
    </ContainerCards>
  );
};

export default CourtBooking;
