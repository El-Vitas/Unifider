import { Module } from '@nestjs/common';
import { UserInterceptor } from './interceptors/user.interceptor';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [UserInterceptor],
  exports: [UserInterceptor, UserModule],
})
export class CommonModule {}
