import { Module } from '@nestjs/common';
import { LocationsController } from './location.controller';
import { LocationService } from './location.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [LocationsController],
  providers: [LocationService],
  imports: [PrismaModule, CommonModule],
})
export class LocationModule {}
