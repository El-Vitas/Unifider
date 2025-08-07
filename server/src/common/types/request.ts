import { UserRole } from 'src/role/entities/roles';
import type { User } from 'src/user/entities/user.entity';

export type RequestUser = {
  payload: {
    email: string;
    role: UserRole;
  };
  data: User;
};
