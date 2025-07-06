export type GymType = {
  id: string;
  name: string;
  description: string;
  location: {
    name: string;
    description?: string;
  }
  imageUrl?: string;
  scheduleByDay: Record<string, string[]>;
};
