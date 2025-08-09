import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { GymBooking } from '../../services/gymBookingsService';

interface BookingListItemProps {
  booking: GymBooking;
  onCancelBooking: (bookingId: string) => void;
  formatTime: (timeString: string) => string;
  formatDate: (dateString: string) => string;
  getDayName: (dayOfWeek: number) => string;
}

export const BookingListItem = ({
  booking,
  onCancelBooking,
  formatTime,
  formatDate,
  getDayName,
}: BookingListItemProps) => {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
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
        onClick={() => onCancelBooking(booking.id)}
        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors ml-4"
      >
        <DeleteOutlined className="w-4 h-4" style={{ fontSize: '16px' }} />
        Cancelar Reserva
      </button>
    </div>
  );
};
