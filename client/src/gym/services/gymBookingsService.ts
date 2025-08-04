import { httpAdapter } from '../../common/adapters/httpAdapter';
import config from '../../config';

export interface GymBooking {
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

export interface GymBookingsResponse {
  gymName: string;
  bookings: GymBooking[];
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

export const gymBookingsService = {
  // Obtener todas las reservas de un gimnasio
  async getGymBookings(
    gymId: string,
    authToken: string,
    filters?: BookingFilters,
  ): Promise<GymBookingsResponse> {
    const params = new URLSearchParams();

    if (filters?.dayOfWeek !== undefined) {
      params.append('dayOfWeek', filters.dayOfWeek.toString());
    }
    if (filters?.timeBlockId) {
      params.append('timeBlockId', filters.timeBlockId);
    }
    if (filters?.startDate) {
      params.append('startDate', filters.startDate.toISOString());
    }
    if (filters?.endDate) {
      params.append('endDate', filters.endDate.toISOString());
    }

    const response = await httpAdapter.get(
      `${config.apiUrl}/gym/${gymId}/bookings?${params.toString()}`,
      {
        headers: {
          authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data as GymBookingsResponse;
  },

  // Cancelar una reserva específica
  async cancelUserBooking(
    gymId: string,
    bookingId: string,
    authToken: string,
  ): Promise<{ success: boolean; cancelledBooking: GymBooking }> {
    const response = await httpAdapter.delete(
      `${config.apiUrl}/gym/${gymId}/bookings/${bookingId}`,
      {
        headers: {
          authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data as { success: boolean; cancelledBooking: GymBooking };
  },

  // Reset masivo de reservas
  async resetGymBookings(
    gymId: string,
    authToken: string,
    options?: ResetBookingsOptions,
  ): Promise<{ success: boolean; deletedCount: number }> {
    const response = await httpAdapter.delete(
      `${config.apiUrl}/gym/${gymId}/bookings/reset`,
      {
        body: JSON.stringify(options),
        headers: {
          authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data as { success: boolean; deletedCount: number };
  },
};
