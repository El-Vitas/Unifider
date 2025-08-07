import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
import { LocationModule } from './location/location.module';
import { SectionModule } from './section/section.module';
import { EquipmentModule } from './equipment/equipment.module';
import { ScheduleModule } from './schedule/schedule.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomBytes } from 'crypto';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '..', 'uploads', 'gym-images'),
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const randomSuffix = randomBytes(16).toString('hex');
          const ext = file.originalname.split('.').pop();
          cb(null, `${file.fieldname}-${timestamp}-${randomSuffix}.${ext}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
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
    LocationModule,
    SectionModule,
    EquipmentModule,
    ScheduleModule,
  ],
})
export class AppModule {}
