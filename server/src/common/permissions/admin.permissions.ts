import { RolePermissions } from '../types/permission';
import { Action } from './permission.enum';
import { Resource } from './permission.enum';

export const AdminPermissions: RolePermissions = {
  [Action.CREATE]: [Resource.GYM, Resource.LOCATION],
  [Action.READ]: [Resource.GYM, Resource.LOCATION],
  [Action.UPDATE]: [Resource.GYM, Resource.LOCATION],
  [Action.DELETE]: [Resource.GYM, Resource.LOCATION],
};
