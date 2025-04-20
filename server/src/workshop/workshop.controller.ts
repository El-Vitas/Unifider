import { Controller, Get, Param } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { isUUID } from 'class-validator';

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

  @Get(':value')
  async findOne(@Param('value') value: string) {
    if (isUUID(value)) {
      return this.workshopService.findOneById(value);
    } else {
      return this.workshopService.findOneByName(value);
    }
  }
}
