import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const checkIfIsPublic = (
  context: ExecutionContext,
  reflector: Reflector,
) => {
  return reflector.getAllAndOverride<boolean>('isPublic', [
    context.getHandler(),
    context.getClass(),
  ]);
};
