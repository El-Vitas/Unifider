import { Module } from '@nestjs/common';
import { CourtService } from './court.service';
import { CourtController } from './court.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CourtController],
  providers: [CourtService],
  imports: [PrismaModule],
})
export class CourtModule {}
