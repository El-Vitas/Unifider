import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

interface RequestUser {
  email: string;
  role: string;
}

export const User = createParamDecorator(
  (
    data: keyof RequestUser | undefined,
    ctx: ExecutionContext,
  ): string | RequestUser => {
    const request = ctx.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    if (data) {
      if (!(data in user)) {
        throw new UnauthorizedException(`User property '${data}' not found`);
      }
      return user[data];
    }

    return user;
  },
);
