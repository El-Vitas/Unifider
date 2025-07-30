import { RolePermissions } from '../types/permission';
import { Action } from './permission.enum';
import { Resource } from './permission.enum';

export const AdminPermissions: RolePermissions = {
  [Action.CREATE]: [
    Resource.GYM,
    Resource.LOCATION,
    Resource.EQUIPMENT,
    Resource.USER,
    Resource.ROLE,
  ],
  [Action.READ]: [
    Resource.GYM,
    Resource.LOCATION,
    Resource.EQUIPMENT,
    Resource.USER,
    Resource.ROLE,
  ],
  [Action.UPDATE]: [
    Resource.GYM,
    Resource.LOCATION,
    Resource.EQUIPMENT,
    Resource.USER,
    Resource.ROLE,
  ],
  [Action.DELETE]: [
    Resource.GYM,
    Resource.LOCATION,
    Resource.EQUIPMENT,
    Resource.USER,
    Resource.ROLE,
  ],
};
