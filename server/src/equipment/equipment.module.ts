import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [EquipmentController],
  providers: [EquipmentService],
  imports: [PrismaModule, CommonModule],
})
export class EquipmentModule {}
