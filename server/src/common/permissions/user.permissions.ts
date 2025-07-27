import { RolePermissions } from '../types/permission';
import { Action } from './permission.enum';
import { Resource } from './permission.enum';

export const UserPermissions: RolePermissions = {
  [Action.CREATE]: [],
  [Action.READ]: [Resource.GYM, Resource.LOCATION],
  [Action.UPDATE]: [],
  [Action.DELETE]: [],
};
