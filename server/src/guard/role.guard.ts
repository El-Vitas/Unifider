import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/role/entities/roles';
import { RequestUser } from 'src/common/types/request';
import { checkIfIsPublic } from 'src/common/utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (checkIfIsPublic(context, this.reflector)) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const role = request.user?.payload?.role;
    if (!role) {
      throw new ForbiddenException('No roles found for user');
    }

    if (!this.checkRole(requiredRoles, role)) {
      throw new ForbiddenException('Access denied');
    }
    return true;
  }

  private checkRole(requiredRoles: UserRole[], role: UserRole): boolean {
    return requiredRoles.includes(role);
  }
}
