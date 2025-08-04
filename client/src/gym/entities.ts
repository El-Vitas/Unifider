import type { EquipmentType } from '../equipment/entities';
import type { LocationType } from '../location/entities';

export type ScheduleTimeBlockRequest = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  capacity: number;
  isEnabled: boolean;
};

// Gym creation request (as FormData)
export type GymCreateRequest = {
  name: string;
  description?: string;
  locationId: string;
  equipment: string[]; // Array of equipment IDs
  schedule: {
    timeBlocks: ScheduleTimeBlockRequest[];
  };
  // Note: image file will be sent as FormData field, not as JSON property
};

export type GymType = {
  id: string;
  name: string;
  description?: string;
  locationId: string;
  location: LocationType;
  equipment: EquipmentType[];
  imageUrl?: string; // Backend returns URL like "/uploads/gym-images/filename.jpg"
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
