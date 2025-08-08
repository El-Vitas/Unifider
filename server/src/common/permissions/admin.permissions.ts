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
    Resource.SCHEDULE,
    Resource.BOOKING,
    Resource.COURT,
  ],
  [Action.READ]: [
    Resource.GYM,
    Resource.LOCATION,
    Resource.EQUIPMENT,
    Resource.USER,
    Resource.ROLE,
    Resource.SCHEDULE,
    Resource.BOOKING,
    Resource.COURT,
  ],
  [Action.UPDATE]: [
    Resource.GYM,
    Resource.LOCATION,
    Resource.EQUIPMENT,
    Resource.USER,
    Resource.ROLE,
    Resource.SCHEDULE,
    Resource.BOOKING,
    Resource.COURT,
  ],
  [Action.DELETE]: [
    Resource.GYM,
    Resource.LOCATION,
    Resource.EQUIPMENT,
    Resource.USER,
    Resource.ROLE,
    Resource.SCHEDULE,
    Resource.BOOKING,
    Resource.COURT,
  ],
};
