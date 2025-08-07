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
import { customToast } from '../../utils/customToast';
import { useAuth } from '../../hooks/useAuth';

export interface Booking {
  id: string;
  bookingDate: Date;
  createdAt: Date;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  scheduleTimeBlock: {
    id: string;
    dayOfWeek: number;
    startTime: Date;
    endTime: Date;
    capacity: number;
  };
}

export interface BookingsResponse {
  entityName: string;
  bookings: Booking[];
  totalBookings: number;
}

export interface BookingFilters {
  dayOfWeek?: number;
  timeBlockId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ResetBookingsOptions {
  dayOfWeek?: number;
  timeBlockId?: string;
  reason?: string;
}

export interface BookingsService {
  getBookings: (
    entityId: string,
    authToken: string,
    filters?: BookingFilters,
  ) => Promise<BookingsResponse>;
  cancelBooking: (
    entityId: string,
    bookingId: string,
    authToken: string,
  ) => Promise<{ success: boolean; cancelledBooking: Booking }>;
  resetBookings: (
    entityId: string,
    authToken: string,
    options?: ResetBookingsOptions,
  ) => Promise<{ success: boolean; deletedCount: number }>;
}

interface BookingsManagerProps {
  entityId: string;
  entityName: string;
  entityType: string;
  isOpen: boolean;
  onClose: () => void;
  service: BookingsService;
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

export const BookingsManager: React.FC<BookingsManagerProps> = ({
  entityId,
  entityName,
  entityType,
  isOpen,
  onClose,
  service,
}) => {
  const { authToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const [filters, setFilters] = useState<BookingFilters>({});
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
      const data = await service.getBookings(entityId, authToken, filters);
      setBookings(data.bookings);
      setTotalBookings(data.totalBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      customToast.error('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  }, [entityId, authToken, filters, service]);

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
    if (isOpen && entityId) {
      fetchBookings();
    }
  }, [isOpen, entityId, fetchBookings]);

  const handleCancelBooking = useCallback(
    async (bookingId: string) => {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres cancelar esta reserva?\n\nEsta acción no se puede deshacer.',
      );

      if (!confirmed || !authToken) return;

      try {
        await service.cancelBooking(entityId, bookingId, authToken);
        customToast.success('Reserva cancelada exitosamente');
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        customToast.error('Error al cancelar la reserva');
      }
    },
    [entityId, authToken, service, fetchBookings],
  );

  const handleResetBookings = useCallback(async () => {
    if (!authToken) return;

    try {
      setIsResetting(true);
      const options: ResetBookingsOptions = {};

      if (selectedDay !== 'all') {
        options.dayOfWeek = parseInt(selectedDay);
      }

      const result = await service.resetBookings(entityId, authToken, options);
      customToast.success(
        `Se eliminaron ${result.deletedCount} reservas exitosamente`,
      );
      setShowResetConfirm(false);
      fetchBookings();
    } catch (error) {
      console.error('Error resetting bookings:', error);
      customToast.error('Error al resetear las reservas');
    } finally {
      setIsResetting(false);
    }
  }, [entityId, authToken, selectedDay, service, fetchBookings]);

  const handleDayFilterChange = useCallback((day: string) => {
    setSelectedDay(day);
    setFilters((prev) => ({
      ...prev,
      dayOfWeek: day === 'all' ? undefined : parseInt(day),
    }));
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <CalendarOutlined className="text-2xl text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Gestión de Reservas - {entityName}
              </h2>
              <p className="text-gray-600">
                {totalBookings} reservas totales en este {entityType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CloseOutlined className="text-xl text-gray-500" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center space-x-2">
                <FilterOutlined className="text-primary" />
                <span className="font-medium text-gray-700">Filtros:</span>
              </div>

              <select
                value={selectedDay}
                onChange={(e) => handleDayFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Todos los días</option>
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day.value} value={day.value.toString()}>
                    {day.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-w-[250px]"
              />
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              disabled={isResetting}
            >
              <DeleteOutlined />
              <span>Reset Reservas</span>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Cargando reservas...</div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarOutlined className="text-4xl text-gray-300 mb-2" />
              <div className="text-gray-500">No hay reservas que mostrar</div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <UserOutlined className="text-primary" />
                        <span className="font-semibold text-gray-800">
                          {booking.user.fullName}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({booking.user.email})
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <CalendarOutlined />
                          <span>
                            {DAYS_OF_WEEK[booking.scheduleTimeBlock.dayOfWeek]
                              ?.label || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockCircleOutlined />
                          <span>
                            {new Date(
                              booking.scheduleTimeBlock.startTime,
                            ).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            -{' '}
                            {new Date(
                              booking.scheduleTimeBlock.endTime,
                            ).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Reservado:{' '}
                          {new Date(booking.createdAt).toLocaleDateString(
                            'es-ES',
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancelar reserva"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <ExclamationCircleOutlined className="text-2xl text-red-500" />
                <h3 className="text-lg font-bold text-gray-800">
                  Confirmar Reset
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar todas las reservas
                {selectedDay !== 'all'
                  ? ` del día ${
                      DAYS_OF_WEEK.find(
                        (d) => d.value.toString() === selectedDay,
                      )?.label
                    }`
                  : ''}{' '}
                de este {entityType}?
              </p>

              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isResetting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResetBookings}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  disabled={isResetting}
                >
                  {isResetting ? 'Eliminando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
