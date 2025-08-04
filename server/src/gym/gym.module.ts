import { Module } from '@nestjs/common';
import { GymService } from './gym.service';
import { GymController } from './gym.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [GymController],
  providers: [GymService],
  imports: [PrismaModule, ScheduleModule, CommonModule],
})
export class GymModule {}
