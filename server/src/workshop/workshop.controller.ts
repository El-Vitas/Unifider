import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { WorkshopService } from './workshop.service';

@Controller('workshop')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Get()
  findAll() {
    return this.workshopService.findAll();
  }

  @Get('/detailed')
  findAllWithExtraData() {
    return this.workshopService.findAllWithExtraData();
  }

  @Get(':id')
  findOneById(@Param('id', ParseUUIDPipe) id: string) {
    return this.workshopService.findOneById(id);
  }
}
