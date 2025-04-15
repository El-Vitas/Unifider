import { User as UserPrisma } from '@prisma/client';

export class User implements UserPrisma {
  id: string;
  fullName: string;
  email: string;
  password: string;
  roleId: string;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
