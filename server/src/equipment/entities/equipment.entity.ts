import { Equipment as EquipmentPrisma } from '@prisma/client';

export class Equipment implements EquipmentPrisma {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
