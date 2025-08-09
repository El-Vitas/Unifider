import { Module } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { WorkshopController } from './workshop.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [WorkshopController],
  providers: [WorkshopService],
  imports: [PrismaModule, CommonModule],
})
export class WorkshopModule {}
