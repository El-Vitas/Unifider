import { SetMetadata } from '@nestjs/common';
import type { PermissionEntry } from '../types/permission';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: PermissionEntry[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
