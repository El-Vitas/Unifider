import type { LocationType } from "../location/entities";

export type GymType = {
  id: string;
  name: string;
  description: string;
  location: LocationType
  imageUrl?: string;
  scheduleByDay: Record<string, string[]>;
};
