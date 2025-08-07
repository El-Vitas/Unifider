import type { PermissionEntry } from 'src/common/types/permission';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/common/decorators/permissions.decorator';
import { RequestUser } from 'src/common/types/request';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';
import { UserRole } from 'src/role/entities/roles';
import { UserPermissions } from 'src/common/permissions/user.permissions';
import { AdminPermissions } from 'src/common/permissions/admin.permissions';
import type { RolePermissions } from 'src/common/types/permission';
import { checkIfIsPublic } from 'src/common/utils';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (checkIfIsPublic(context, this.reflector)) {
      return true;
    }

    const requiredPermissions = this.reflector.get<PermissionEntry[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return false;
    }
    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const role = request.user?.payload?.role as UserRole;
    if (!role) {
      throw new ForbiddenException('No roles found for user');
    }
    const permission = this.getRolePermissions(role);
    return this.checkPermissions(requiredPermissions, permission);
  }

  private getRolePermissions(role: UserRole): RolePermissions {
    switch (role) {
      case UserRole.ADMIN:
        return AdminPermissions;
      case UserRole.USER:
        return UserPermissions;
      default:
        throw new ForbiddenException('Access denied for this role');
    }
  }

  private checkPermissions(
    requiredPermissions: PermissionEntry[],
    permission: RolePermissions,
  ) {
    return requiredPermissions.every((reqPerm) =>
      permission[reqPerm.action]?.includes(reqPerm.resource),
    );
  }
}
