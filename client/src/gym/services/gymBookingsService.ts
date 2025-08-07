import { httpAdapter } from '../../common/adapters/httpAdapter';
import config from '../../config';

export interface GymBooking {
  id: string;
  scheduleTimeBlockId: string;
  userId: string;
  user: {
    fullName: string;
    email: string;
  };
  scheduleTimeBlock: {
    startTime: string;
    endTime: string;
    dayOfWeek: number;
  };
  bookingDate: string;
  createdAt: string;
}

export interface BookingFilters {
  userId?: string;
  timeBlockId?: string;
  dayOfWeek?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface DeleteBookingsResult {
  deletedCount: number;
}

const getAllBookings = async (
  gymId: string,
  filters: BookingFilters = {},
  authToken: string,
): Promise<{ data: GymBooking[]; total: number }> => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  const response = await httpAdapter.get<{ data: GymBooking[]; total: number }>(
    `${config.apiUrl}/gym/${gymId}/bookings?${queryParams.toString()}`,
    {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    },
  );

  return response.data;
};

const cancelUserBooking = async (
  gymId: string,
  bookingId: string,
  authToken: string,
): Promise<void> => {
  await httpAdapter.delete(
    `${config.apiUrl}/gym/${gymId}/booking/${bookingId}`,
    {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    },
  );
};

const deleteAllBookings = async (
  gymId: string,
  dayOfWeek?: number,
  authToken?: string,
): Promise<DeleteBookingsResult> => {
  const queryParams = new URLSearchParams();
  if (dayOfWeek !== undefined) {
    queryParams.append('dayOfWeek', dayOfWeek.toString());
  }

  const response = await httpAdapter.delete<DeleteBookingsResult>(
    `${config.apiUrl}/gym/${gymId}/bookings?${queryParams.toString()}`,
    {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    },
  );

  return response.data;
};

export const gymBookingsService = {
  getAllBookings,
  getGymBookings: getAllBookings,
  cancelUserBooking,
  deleteAllBookings,
  resetGymBookings: deleteAllBookings,
};
