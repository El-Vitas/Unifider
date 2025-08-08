import type { LocationType } from '../location/entities';

export type ScheduleTimeBlockRequest = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  isEnabled: boolean;
};

export type CourtCreateRequest = {
  name: string;
  description?: string;
  locationId: string;
  schedule: {
    timeBlocks: ScheduleTimeBlockRequest[];
  };
};

export type CourtType = {
  id: string;
  name: string;
  description?: string;
  locationId: string;
  location: LocationType;
  imageUrl?: string; 
  scheduleId: string;
  schedule?: {
    timeBlocks: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      capacity: number;
      isEnabled: boolean;
    }>;
  };
  createdAt: string;
  updatedAt: string;
};
