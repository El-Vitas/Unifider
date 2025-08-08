import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  courtBookingsService,
  type CourtBooking,
  type BookingFilters,
} from '../services/courtBookingsService';
import { customToast } from '../../common/utils/customToast';
import { useAuth } from '../../common/hooks/useAuth';
import BtnPrimary from '../../common/components/button/BtnPrimary';
import {
  BookingPageHeader,
  BookingFiltersControls,
  BookingStatsDisplay,
  BookingListItem,
  BookingEmptyState,
  ResetConfirmationModal,
} from '../components/booking';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

const CourtBookings = () => {
  const { courtId } = useParams<{ courtId: string }>();
  const navigate = useNavigate();
  const { authToken } = useAuth();

  const [bookings, setBookings] = useState<CourtBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);

  const [filters, setFilters] = useState<BookingFilters>({});
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!authToken || !courtId) {
      customToast.error('No estás autenticado o falta el ID de la cancha');
      return;
    }

    try {
      setLoading(true);
      const data = await courtBookingsService.getCourtBookings(
        courtId,
        filters,
        authToken,
      );
      setBookings(data.data);
      setTotalBookings(data.total);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      customToast.error('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  }, [courtId, authToken, filters]);

  const filteredBookings = useMemo(() => {
    if (!bookings || !Array.isArray(bookings)) return [];
    if (!searchTerm) return bookings;

    return bookings.filter(
      (booking) =>
        booking.user.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [bookings, searchTerm]);

  useEffect(() => {
    if (courtId) {
      fetchBookings();
    }
  }, [courtId, fetchBookings]);

  const handleCancelBooking = useCallback(
    async (bookingId: string) => {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres cancelar esta reserva?\n\nEsta acción no se puede deshacer.',
      );

      if (!confirmed) return;

      if (!authToken || !courtId) {
        customToast.error('No estás autenticado');
        return;
      }

      try {
        await courtBookingsService.cancelUserBooking(
          courtId,
          bookingId,
          authToken,
        );
        customToast.success('Reserva cancelada exitosamente');
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        customToast.error('Error al cancelar la reserva');
      }
    },
    [courtId, authToken, fetchBookings],
  );

  const handleResetAllBookings = useCallback(async () => {
    if (!authToken || !courtId) {
      customToast.error('No estás autenticado');
      return;
    }

    try {
      setIsResetting(true);

      const result = await courtBookingsService.resetCourtBookings(
        courtId,
        selectedDay !== 'all' ? parseInt(selectedDay) : undefined,
        authToken,
      );

      customToast.success(
        `${result.deletedCount} reservas eliminadas exitosamente`,
      );
      setShowResetConfirm(false);
      fetchBookings();
    } catch (error) {
      console.error('Error resetting bookings:', error);
      customToast.error('Error al eliminar las reservas');
    } finally {
      setIsResetting(false);
    }
  }, [courtId, authToken, selectedDay, fetchBookings]);

  const handleDayFilterChange = useCallback((day: string) => {
    setSelectedDay(day);
    if (day === 'all') {
      setFilters({});
    } else {
      setFilters({ dayOfWeek: parseInt(day) });
    }
  }, []);

  const formatTime = useMemo(
    () => (timeString: string) => {
      return timeString.slice(0, 5);
    },
    [],
  );

  const formatDate = useMemo(
    () => (dateString: string) => {
      return new Date(dateString).toLocaleDateString('es-ES');
    },
    [],
  );

  const getDayName = useMemo(
    () => (dayOfWeek: number) => {
      return (
        DAYS_OF_WEEK.find((day) => day.value === dayOfWeek)?.label ||
        'Desconocido'
      );
    },
    [],
  );

  if (!courtId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Error: ID de cancha no encontrado
          </h1>
          <BtnPrimary onClick={() => navigate('/court')} className="mt-4">
            Volver a Canchas
          </BtnPrimary>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BookingPageHeader onBackClick={() => navigate('/court')} />

      <BookingFiltersControls
        selectedDay={selectedDay}
        searchTerm={searchTerm}
        filteredBookingsLength={filteredBookings.length}
        daysOfWeek={DAYS_OF_WEEK}
        onDayChange={handleDayFilterChange}
        onSearchChange={setSearchTerm}
        onResetClick={() => setShowResetConfirm(true)}
      />

      <BookingStatsDisplay
        totalBookings={totalBookings}
        filteredCount={filteredBookings.length}
        selectedDay={selectedDay}
        getDayName={getDayName}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005E90]"></div>
            <span className="ml-3 text-gray-600">Cargando reservas...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <BookingEmptyState searchTerm={searchTerm} />
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <BookingListItem
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
                formatTime={formatTime}
                formatDate={formatDate}
                getDayName={getDayName}
              />
            ))}
          </div>
        )}
      </div>

      <ResetConfirmationModal
        isOpen={showResetConfirm}
        selectedDay={selectedDay}
        filteredBookingsLength={filteredBookings.length}
        isLoading={isResetting}
        getDayName={getDayName}
        onConfirm={handleResetAllBookings}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};

export default CourtBookings;
