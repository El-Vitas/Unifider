import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { GymBooking } from '../services/gymBookingsService';

interface BookingItemProps {
  booking: GymBooking;
  formatTime: (timeString: string) => string;
  formatDate: (dateString: string) => string;
  getDayName: (dayOfWeek: number) => string;
  onCancel: (bookingId: string) => void;
}

export const BookingItem = ({
  booking,
  formatTime,
  formatDate,
  getDayName,
  onCancel,
}: BookingItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="font-medium text-gray-900">
              {booking.user.fullName}
            </h3>
            <p className="text-sm text-gray-600">{booking.user.email}</p>
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
        onClick={() => onCancel(booking.id)}
        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        <CloseOutlined className="w-4 h-4" style={{ fontSize: '16px' }} />
        Cancelar
      </button>
    </div>
  );
};
