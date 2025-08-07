import { Court as CourtPrisma } from '@prisma/client';

export class Court implements CourtPrisma {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  locationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  scheduleId: string;
}
