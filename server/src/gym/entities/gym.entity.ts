import { Gym as GymPrisma } from '@prisma/client';

export class Gym implements GymPrisma {
  id: string;
  name: string;
  description: string | null;
  locationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
  scheduleId: string;
}
