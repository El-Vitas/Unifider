import { Role as RolePrisma } from '@prisma/client';

export class User implements RolePrisma {
  id: string;
  name: string;
}
