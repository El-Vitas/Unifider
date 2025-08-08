import { httpAdapter } from '../../common/adapters/httpAdapter';
import config from '../../config';

export interface CourtBooking {
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
  courtId: string,
  filters: BookingFilters = {},
  authToken: string,
): Promise<{ data: CourtBooking[]; total: number }> => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  const response = await httpAdapter.get<{
    data: CourtBooking[];
    total: number;
  }>(`${config.apiUrl}/court/${courtId}/bookings?${queryParams.toString()}`, {
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  });

  return response.data;
};

const cancelUserBooking = async (
  courtId: string,
  bookingId: string,
  authToken: string,
): Promise<void> => {
  console.log(courtId);
  await httpAdapter.delete(
    `${config.apiUrl}/court/${courtId}/bookings/${bookingId}`,
    {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    },
  );
};

const deleteAllBookings = async (
  courtId: string,
  dayOfWeek?: number,
  authToken?: string,
): Promise<DeleteBookingsResult> => {
  const body: { dayOfWeek?: number } = {};
  if (dayOfWeek !== undefined) {
    body.dayOfWeek = dayOfWeek;
  }

  const response = await httpAdapter.post<DeleteBookingsResult>(
    `${config.apiUrl}/court/${courtId}/bookings/reset`,
    body,
    {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    },
  );

  return response.data;
};

export const courtBookingsService = {
  getAllBookings,
  getCourtBookings: getAllBookings,
  cancelUserBooking,
  deleteAllBookings,
  resetCourtBookings: deleteAllBookings,
};
