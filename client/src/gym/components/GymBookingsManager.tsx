import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CloseOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import {
  gymBookingsService,
  type GymBooking,
  type BookingFilters,
} from '../services/gymBookingsService';
import { customToast } from '../../common/utils/customToast';
import { useAuth } from '../../common/hooks/useAuth';

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

  // Filtros
  const [filters, setFilters] = useState<BookingFilters>({});
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para acciones
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
        authToken,
        filters,
      );
      setBookings(data.bookings);
      setTotalBookings(data.totalBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      customToast.error('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  }, [gymId, authToken, filters]);

  const filteredBookings = useMemo(() => {
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
        fetchBookings(); // Recargar la lista
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
      const options =
        selectedDay !== 'all'
          ? { dayOfWeek: parseInt(selectedDay) }
          : undefined;

      const result = await gymBookingsService.resetGymBookings(
        gymId,
        authToken,
        options,
      );

      customToast.success(
        `${result.deletedCount} reservas eliminadas exitosamente`,
      );
      setShowResetConfirm(false);
      fetchBookings(); // Recargar la lista
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
    () => (date: Date) => {
      return new Date(date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    [],
  );

  const formatDate = useMemo(
    () => (date: Date) => {
      return new Date(date).toLocaleDateString('es-ES');
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

        {/* Filtros y búsqueda */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filtro por día */}
            <div className="flex items-center gap-2">
              <FilterOutlined
                className="w-4 h-4 text-gray-500"
                style={{ fontSize: '16px' }}
              />
              <select
                value={selectedDay}
                onChange={(e) => handleDayFilterChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005E90]"
              >
                <option value="all">Todos los días</option>
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day.value} value={day.value.toString()}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda por usuario */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005E90]"
              />
            </div>

            {/* Botón de reset */}
            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={filteredBookings.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <DeleteOutlined
                className="w-4 h-4"
                style={{ fontSize: '16px' }}
              />
              Reset Reservas
            </button>
          </div>

          {/* Estadísticas */}
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
            <span>Total: {totalBookings} reservas</span>
            <span>Mostrando: {filteredBookings.length} reservas</span>
            {selectedDay !== 'all' && (
              <span>Día: {getDayName(parseInt(selectedDay))}</span>
            )}
          </div>
        </div>

        {/* Lista de reservas */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005E90]"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <UserOutlined
                className="w-12 h-12 mb-4 opacity-50"
                style={{ fontSize: '48px' }}
              />
              <p className="text-lg font-medium">No hay reservas</p>
              <p className="text-sm">
                {searchTerm
                  ? 'No se encontraron reservas con ese criterio de búsqueda'
                  : 'Este gimnasio no tiene reservas activas'}
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-3">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {booking.user.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {booking.user.email}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CalendarOutlined
                            className="w-4 h-4"
                            style={{ fontSize: '16px' }}
                          />
                          {getDayName(booking.scheduleTimeBlock.dayOfWeek)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockCircleOutlined
                            className="w-4 h-4"
                            style={{ fontSize: '16px' }}
                          />
                          {formatTime(booking.scheduleTimeBlock.startTime)} -{' '}
                          {formatTime(booking.scheduleTimeBlock.endTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Reservado: {formatDate(booking.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <CloseOutlined
                      className="w-4 h-4"
                      style={{ fontSize: '16px' }}
                    />
                    Cancelar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de confirmación para reset */}
        {showResetConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <ExclamationCircleOutlined
                  className="w-6 h-6 text-red-600"
                  style={{ fontSize: '24px', color: '#dc2626' }}
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar eliminación
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar{' '}
                {selectedDay === 'all'
                  ? 'TODAS'
                  : `las reservas del ${getDayName(parseInt(selectedDay))}`}{' '}
                las reservas de este gimnasio?
                <br />
                <br />
                <strong>
                  Esta acción no se puede deshacer y afectará a{' '}
                  {filteredBookings.length} usuarios.
                </strong>
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResetAllBookings}
                  disabled={isResetting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isResetting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <DeleteOutlined
                        className="w-4 h-4"
                        style={{ fontSize: '16px' }}
                      />
                      Confirmar eliminación
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
