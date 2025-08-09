import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SectionController],
  providers: [SectionService],
  imports: [PrismaModule, CommonModule],
})
export class SectionModule {}
