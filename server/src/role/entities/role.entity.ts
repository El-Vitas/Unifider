import { Role as RolePrisma } from '@prisma/client';

export class Role implements RolePrisma {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
