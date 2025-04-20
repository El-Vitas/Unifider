import { Controller, Get } from '@nestjs/common';
import { GymService } from './gym.service';

@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Get('cards-info')
  findAll() {
    return this.gymService.findCardsInfo();
  }
}
