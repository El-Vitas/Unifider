import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import {
  gymBookingsService,
  type GymBooking,
  type BookingFilters as BookingFiltersType,
} from '../../services/gymBookingsService';
import { customToast } from '../../../common/utils/customToast';
import { useAuth } from '../../../common/hooks/useAuth';
import {
  BookingFilters,
  BookingStats,
  BookingItem,
  EmptyState,
  ConfirmationModal,
} from '../../../common/components/booking-management';

interface GymBookingsManagerProps {
  gymId: string;
  gymName: string;
  isOpen: boolean;
  onClose: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export const GymBookingsManager: React.FC<GymBookingsManagerProps> = ({
  gymId,
  gymName,
  isOpen,
  onClose,
}) => {
  const { authToken } = useAuth();
  const [bookings, setBookings] = useState<GymBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const [filters, setFilters] = useState<BookingFiltersType>({});
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!authToken) {
      customToast.error('No estás autenticado');
      return;
    }

    try {
      setLoading(true);
      const data = await gymBookingsService.getGymBookings(
        gymId,
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
  }, [gymId, authToken, filters]);

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
    if (isOpen && gymId) {
      fetchBookings();
    }
  }, [isOpen, gymId, fetchBookings]);

  const handleCancelBooking = useCallback(
    async (bookingId: string) => {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres cancelar esta reserva?\n\nEsta acción no se puede deshacer.',
      );

      if (!confirmed) return;

      if (!authToken) {
        customToast.error('No estás autenticado');
        return;
      }

      try {
        await gymBookingsService.cancelUserBooking(gymId, bookingId, authToken);
        customToast.success('Reserva cancelada exitosamente');
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        customToast.error('Error al cancelar la reserva');
      }
    },
    [gymId, authToken, fetchBookings],
  );

  const handleResetAllBookings = useCallback(async () => {
    if (!authToken) {
      customToast.error('No estás autenticado');
      return;
    }

    try {
      setIsResetting(true);

      const result = await gymBookingsService.resetGymBookings(
        gymId,
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
  }, [gymId, authToken, selectedDay, fetchBookings]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <UserOutlined
              className="w-6 h-6 text-[#005E90]"
              style={{ fontSize: '24px', color: '#005E90' }}
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Gestionar Reservas
              </h2>
              <p className="text-sm text-gray-600">{gymName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <CloseOutlined className="w-5 h-5" style={{ fontSize: '20px' }} />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <BookingFilters
            selectedDay={selectedDay}
            searchTerm={searchTerm}
            filteredBookingsLength={filteredBookings.length}
            daysOfWeek={DAYS_OF_WEEK}
            onDayChange={handleDayFilterChange}
            onSearchChange={setSearchTerm}
            onResetClick={() => setShowResetConfirm(true)}
          />

          <BookingStats
            totalBookings={totalBookings}
            filteredCount={filteredBookings.length}
            selectedDay={selectedDay}
            getDayName={getDayName}
          />
        </div>

        <div className="flex-1 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005E90]"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <EmptyState searchTerm={searchTerm} />
          ) : (
            <div className="p-6 space-y-3">
              {filteredBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={booking}
                  formatTime={formatTime}
                  formatDate={formatDate}
                  getDayName={getDayName}
                  onCancel={handleCancelBooking}
                />
              ))}
            </div>
          )}
        </div>

        <ConfirmationModal
          isOpen={showResetConfirm}
          isLoading={isResetting}
          selectedDay={selectedDay}
          filteredBookingsLength={filteredBookings.length}
          getDayName={getDayName}
          onConfirm={handleResetAllBookings}
          onCancel={() => setShowResetConfirm(false)}
        />
      </div>
    </div>
  );
};
