import { Module } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { WorkshopController } from './workshop.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [WorkshopController],
  providers: [WorkshopService],
  imports: [PrismaModule],
})
export class WorkshopModule {}
