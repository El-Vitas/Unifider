import { Module } from '@nestjs/common';
import { TeamsController } from './team.controller';
import { TeamService } from './team.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [TeamsController],
  providers: [TeamService],
  imports: [PrismaModule, CommonModule],
})
export class TeamModule {}
