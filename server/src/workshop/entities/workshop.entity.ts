import { Workshop as WorkshopPrisma } from '@prisma/client';

export class Workshop implements WorkshopPrisma {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
  description: string | null;
  createdBy: string;
}
