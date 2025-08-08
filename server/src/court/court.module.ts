import { Module } from '@nestjs/common';
import { CourtService } from './court.service';
import { CourtController } from './court.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [CourtController],
  providers: [CourtService],
  imports: [PrismaModule, ScheduleModule, CommonModule],
})
export class CourtModule {}
