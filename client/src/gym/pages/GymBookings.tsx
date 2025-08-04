import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
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
import BtnPrimary from '../../common/components/button/BtnPrimary';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

const GymBookings = () => {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  const { authToken } = useAuth();

  const [bookings, setBookings] = useState<GymBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const [gymName, setGymName] = useState<string>('');

  // Filtros
  const [filters, setFilters] = useState<BookingFilters>({});
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para acciones
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!authToken || !gymId) {
      customToast.error('No estás autenticado o falta el ID del gimnasio');
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
      setGymName(data.gymName);
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
    if (gymId) {
      fetchBookings();
    }
  }, [gymId, fetchBookings]);

  const handleCancelBooking = useCallback(
    async (bookingId: string) => {
      const confirmed = window.confirm(
        '¿Estás seguro de que quieres cancelar esta reserva?\n\nEsta acción no se puede deshacer.',
      );

      if (!confirmed) return;

      if (!authToken || !gymId) {
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
    if (!authToken || !gymId) {
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

  if (!gymId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Error: ID de gimnasio no encontrado
          </h1>
          <BtnPrimary onClick={() => navigate('/gym')} className="mt-4">
            Volver a Gimnasios
          </BtnPrimary>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/gym')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeftOutlined
              className="w-4 h-4"
              style={{ fontSize: '16px' }}
            />
            Volver
          </button>
          <div className="flex items-center gap-3">
            <UserOutlined
              className="w-8 h-8 text-[#005E90]"
              style={{ fontSize: '32px', color: '#005E90' }}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestionar Reservas
              </h1>
              <p className="text-lg text-gray-600">{gymName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
              placeholder="Buscar por nombre o email del usuario..."
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
            <DeleteOutlined className="w-4 h-4" style={{ fontSize: '16px' }} />
            Reset Reservas
          </button>
        </div>

        {/* Estadísticas */}
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
          <span className="font-medium">Total: {totalBookings} reservas</span>
          <span>Mostrando: {filteredBookings.length} reservas</span>
          {selectedDay !== 'all' && (
            <span className="text-[#005E90] font-medium">
              Día: {getDayName(parseInt(selectedDay))}
            </span>
          )}
        </div>
      </div>

      {/* Lista de reservas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005E90]"></div>
            <span className="ml-3 text-gray-600">Cargando reservas...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <UserOutlined
              className="w-16 h-16 mb-4 opacity-50"
              style={{ fontSize: '64px' }}
            />
            <p className="text-xl font-medium mb-2">No hay reservas</p>
            <p className="text-sm text-center max-w-md">
              {searchTerm
                ? 'No se encontraron reservas con ese criterio de búsqueda. Intenta con otros términos.'
                : 'Este gimnasio no tiene reservas activas en este momento.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-6">
                    <div className="min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {booking.user.fullName}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {booking.user.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarOutlined
                          className="w-4 h-4"
                          style={{ fontSize: '16px' }}
                        />
                        <span className="font-medium">
                          {getDayName(booking.scheduleTimeBlock.dayOfWeek)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockCircleOutlined
                          className="w-4 h-4"
                          style={{ fontSize: '16px' }}
                        />
                        <span>
                          {formatTime(booking.scheduleTimeBlock.startTime)} -{' '}
                          {formatTime(booking.scheduleTimeBlock.endTime)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Reservado: {formatDate(booking.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors ml-4"
                >
                  <DeleteOutlined
                    className="w-4 h-4"
                    style={{ fontSize: '16px' }}
                  />
                  Cancelar Reserva
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación para reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <ExclamationCircleOutlined
                className="w-6 h-6 text-red-600"
                style={{ fontSize: '24px', color: '#dc2626' }}
              />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar eliminación masiva
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
  );
};

export default GymBookings;
