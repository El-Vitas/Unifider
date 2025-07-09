import { Controller, Get } from '@nestjs/common';
import { GymService } from './gym.service';
import { Public } from 'src/common/decorators/public.decorator';
import { Param } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Controller('gym')
export class GymController {
  constructor(private readonly gymService: GymService) {}

  @Public()
  @Get()
  findAll() {
    return this.gymService.findGymsData();
  }

  @Public()
  @Get(':value')
  async findOne(@Param('value') value: string) {
    if (isUUID(value)) {
      return await this.gymService.findOneById(value);
    } else {
      return await this.gymService.findOneByName(value);
    }
  }
}
