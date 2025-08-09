import { Action, Resource } from './permission.enum';

export class permissionFactory {
  static canRead(resource: Resource) {
    return { action: Action.READ, resource: resource };
  }

  static canCreate(resource: Resource) {
    return { action: Action.CREATE, resource: resource };
  }

  static canUpdate(resource: Resource) {
    return { action: Action.UPDATE, resource: resource };
  }

  static canDelete(resource: Resource) {
    return { action: Action.DELETE, resource: resource };
  }
}
