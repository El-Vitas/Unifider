import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { UserModule } from './user/user.module';
import { WorkshopModule } from './workshop/workshop.module';
import { GymModule } from './gym/gym.module';
import { TeamModule } from './team/team.module';
import { CourtModule } from './court/court.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { LocationsModule } from './locations/locations.module';
import { SectionModule } from './section/section.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
    }),
    UserModule,
    WorkshopModule,
    GymModule,
    TeamModule,
    CourtModule,
    PrismaModule,
    CommonModule,
    AuthModule,
    RoleModule,
    LocationsModule,
    SectionModule,
  ],
})
export class AppModule {}
