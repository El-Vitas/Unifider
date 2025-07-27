import { Action, Resource } from '../permissions/permission.enum';

export type PermissionEntry = {
  action: Action;
  resource: Resource;
};

export type RolePermissions = {
  [key in Action]?: Resource[];
};
