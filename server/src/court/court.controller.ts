import { Controller, Get } from '@nestjs/common';
import { CourtService } from './court.service';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Get('cards-info')
  findCardsInfo() {
    return this.courtService.findCardsInfo();
  }
}
