import { Court as CourtPrisma } from '@prisma/client';

export class Court implements CourtPrisma {
  name: string;
  id: string;
  description: string | null;
  locationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
}
