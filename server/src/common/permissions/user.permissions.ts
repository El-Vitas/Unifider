import { RolePermissions } from '../types/permission';
import { Action } from './permission.enum';
import { Resource } from './permission.enum';

export const UserPermissions: RolePermissions = {
  [Action.CREATE]: [Resource.BOOKING],
  [Action.READ]: [
    Resource.GYM,
    Resource.LOCATION,
    Resource.SCHEDULE,
    Resource.BOOKING,
    Resource.EQUIPMENT,
    Resource.COURT,
    Resource.TEAM,
  ],
  [Action.UPDATE]: [Resource.BOOKING],
  [Action.DELETE]: [Resource.BOOKING],
};
