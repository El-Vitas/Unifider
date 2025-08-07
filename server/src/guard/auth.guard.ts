import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { checkIfIsPublic } from 'src/common/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (checkIfIsPublic(context, this.reflector)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.getPayloadFromToken(token);
    this.insertPayloadToRequest(request, payload);
    return true;
  }

  private insertPayloadToRequest(
    request: Request,
    payload: { email: string; role: string },
  ): void {
    request['user'] = {
      payload,
      data: null,
    };
  }
  private async getPayloadFromToken(
    token: string,
  ): Promise<{ email: string; role: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<{
        email: string;
        role: string;
      }>(token, {
        secret: this.configService.get<string>('config.jwtSecret'),
      });
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader || typeof authHeader !== 'string') return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
