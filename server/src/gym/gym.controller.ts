import { Controller, Get } from '@nestjs/common';
import { GymService } from './gym.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Public()
  @Get('all')
  findAll() {
    return this.gymService.findGymsData();
  }
}
