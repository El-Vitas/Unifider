import { Module } from '@nestjs/common';
import { GymService } from './gym.service';
import { GymController } from './gym.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [GymController],
  providers: [GymService],
  imports: [PrismaModule],
})
export class GymModule {}
