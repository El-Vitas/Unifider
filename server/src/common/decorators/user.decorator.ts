import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestUser } from '../types/request';
import { User as UserEntity } from 'src/user/entities/user.entity';

export const User = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user?.data;
    console.log(request.user);
    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }
    if (data) {
      if (!(data in user)) {
        throw new UnauthorizedException(`User property '${data}' not found`);
      }
      return user[data] as UserEntity;
    }
    return user;
  },
);
