import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../../user/user.service';
import { RequestUser } from '../types/request';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();

    if (!request.user?.payload) {
      throw new UnauthorizedException('User not authenticated');
    }

    try {
      const user = await this.userService.findOneByEmail(
        request.user.payload.email,
      );

      if (!user) {
        throw new UnauthorizedException('User not found in database');
      }

      request.user.data = user;
    } catch {
      throw new UnauthorizedException('Failed to load user data');
    }

    return next.handle();
  }
}
